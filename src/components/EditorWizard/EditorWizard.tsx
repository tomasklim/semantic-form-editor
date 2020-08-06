import React, { FC, useContext } from 'react';
import FormStructureNode from '../../model/FormStructureNode';
import { Accordion, AccordionDetails } from '@material-ui/core';
import { Constants } from 's-forms';
import useStyles from './EditorWizard.styles';
import {
  moveQuestion,
  removeBeingPrecedingQuestion,
  removeFromSubQuestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '../../utils/formBuilder';
import WizardHeader from '@components/WizardHeader/WizardHeader';
import WizardContent from '@components/WizardContent/WizardContent';
import { DIRECTION } from '../../enums';
import { FormStructureContext } from '../../contexts/FormStructureContext';
import { FormStructureQuestion } from '../../model/FormStructureQuestion';
import AddIcon from '@material-ui/icons/Add';

type Props = {
  question: FormStructureQuestion;
  buildFormUI: (
    question: FormStructureQuestion,
    position: number,
    parentQuestion: FormStructureQuestion
  ) => JSX.Element;
};

const EditorWizard: FC<Props> = ({ question, buildFormUI }) => {
  const classes = useStyles();

  const { getClonedFormStructure, setFormStructure } = useContext(FormStructureContext);

  const relatedQuestions = question[Constants.HAS_SUBQUESTION];

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();

    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      (e.target as HTMLDivElement).classList.add(classes.pageOver);
      e.dataTransfer.dropEffect = 'move';
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      (e.target as HTMLDivElement).classList.remove(classes.pageOver);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).classList.contains(classes.page)) {
      e.preventDefault();

      (e.target as HTMLDivElement).style.opacity = '1';

      document
        .querySelectorAll('*:not([data-droppable=true]):not([draggable=true])')
        .forEach((el) => ((el as HTMLDivElement).style.pointerEvents = 'all'));

      [].forEach.call(document.getElementsByClassName(classes.page), (page: HTMLDivElement) => {
        page.classList.remove(classes.pageOver);
      });

      const destinationPageId = (e.target as HTMLDivElement).id;
      const movingNodeId = e.dataTransfer.types.slice(-1)[0];

      e.dataTransfer.clearData();

      if (!destinationPageId || !movingNodeId) {
        console.warn('Missing destinationPageId or movingNodeId');
        return;
      }

      moveNodeToPage(movingNodeId, destinationPageId);
    }
  };

  const moveNodeToPage = (movingNodeId: string, destinationPageId: string) => {
    const clonedFormStructure = getClonedFormStructure();

    const movingNode = clonedFormStructure.structure.get(movingNodeId);
    const destinationPage = clonedFormStructure.structure.get(destinationPageId);

    if (!movingNode?.data || !movingNode?.parent || !destinationPage?.data) {
      console.warn("Missing movingNode's data or parent, or destinationPage's data");
      return;
    }

    const movingNodeParent = movingNode.parent;

    removePrecedingQuestion(movingNode);

    removeBeingPrecedingQuestion(movingNodeParent, movingNode);

    removeFromSubQuestions(movingNodeParent, movingNode);

    moveQuestion(movingNode, destinationPage);

    destinationPage.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(
      destinationPage.data[Constants.HAS_SUBQUESTION]
    );

    setFormStructure(clonedFormStructure);
  };

  const addNewPage = () => {
    const clonedFormStructure = getClonedFormStructure();

    const id = Math.floor(Math.random() * 10000) + 'editorwizard-page';

    const root = clonedFormStructure.getRoot();

    if (!root) {
      console.error('Missing root');
      return;
    }

    const precedingQuestion: FormStructureQuestion | undefined =
      root.data[Constants.HAS_SUBQUESTION] && root.data[Constants.HAS_SUBQUESTION]?.length
        ? root.data[Constants.HAS_SUBQUESTION]![root.data[Constants.HAS_SUBQUESTION]!.length - 1]
        : undefined;

    // temporary
    const newPage = {
      '@id': id,
      '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
      [Constants.HAS_LAYOUT_CLASS]: ['section', 'wizard-step'],
      [Constants.RDFS_LABEL]: id,
      [Constants.HAS_SUBQUESTION]: [],
      [Constants.HAS_PRECEDING_QUESTION]: precedingQuestion
        ? {
            '@id': precedingQuestion['@id']
          }
        : ''
    };

    const page = new FormStructureNode(root, newPage);

    clonedFormStructure.addNode(newPage['@id'], page);

    moveQuestion(page, root);

    root.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(root.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(clonedFormStructure);
  };

  const movePage = (id: string, direction: DIRECTION) => {
    const clonedFormStructure = getClonedFormStructure();

    const root = clonedFormStructure.getRoot();
    const rootSubQuestions = root.data[Constants.HAS_SUBQUESTION];

    const movingPage = clonedFormStructure.getNode(id);

    if (!movingPage || !rootSubQuestions) {
      console.warn('Missing movingPage or rootSubQuestions');
      return;
    }

    const movingPageData = movingPage.data;

    const movingPagePrecedingQuestion = movingPageData[Constants.HAS_PRECEDING_QUESTION];
    const movingPageIndex = rootSubQuestions.findIndex((q) => q['@id'] === id);

    if (direction === DIRECTION.UP && movingPageIndex !== 0) {
      const precending: FormStructureQuestion = rootSubQuestions[movingPageIndex - 1];

      movingPageData[Constants.HAS_PRECEDING_QUESTION] = precending[Constants.HAS_PRECEDING_QUESTION];

      if (movingPageIndex < rootSubQuestions.length - 1) {
        const following: FormStructureQuestion = rootSubQuestions[movingPageIndex + 1];

        precending[Constants.HAS_PRECEDING_QUESTION] = following[Constants.HAS_PRECEDING_QUESTION];

        following[Constants.HAS_PRECEDING_QUESTION] = movingPagePrecedingQuestion;
      } else {
        precending[Constants.HAS_PRECEDING_QUESTION] = {
          '@id': movingPageData['@id']
        };
      }
    } else if (direction === DIRECTION.DOWN && movingPageIndex !== rootSubQuestions.length - 1) {
      const three: FormStructureQuestion = rootSubQuestions[movingPageIndex + 1];

      if (movingPageIndex + 2 < rootSubQuestions.length) {
        const four: FormStructureQuestion = rootSubQuestions[movingPageIndex + 2]; //
        movingPageData[Constants.HAS_PRECEDING_QUESTION] = four[Constants.HAS_PRECEDING_QUESTION];

        four[Constants.HAS_PRECEDING_QUESTION] = three[Constants.HAS_PRECEDING_QUESTION];

        three[Constants.HAS_PRECEDING_QUESTION] = movingPagePrecedingQuestion;
      } else {
        three[Constants.HAS_PRECEDING_QUESTION] = movingPagePrecedingQuestion;

        movingPageData[Constants.HAS_PRECEDING_QUESTION] = {
          '@id': three['@id']
        };
      }
    }

    root.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(rootSubQuestions);

    setFormStructure(clonedFormStructure);
  };

  return (
    <React.Fragment>
      {relatedQuestions &&
        relatedQuestions.map((q, index) => (
          <div
            key={q['@id']}
            id={q['@id']}
            className={classes.page}
            data-droppable={true}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Accordion expanded={true} className={classes.accordion}>
              <WizardHeader question={q} movePage={movePage} position={index + 1} />
              <WizardContent question={q} buildFormUI={buildFormUI} />
            </Accordion>
          </div>
        ))}
      <div className={classes.page}>
        <Accordion expanded={true} className={classes.accordion} onClick={addNewPage} title={'Add new page'}>
          <AccordionDetails className={classes.newPage}>
            <AddIcon />
          </AccordionDetails>
        </Accordion>
      </div>
    </React.Fragment>
  );
};

export default EditorWizard;
