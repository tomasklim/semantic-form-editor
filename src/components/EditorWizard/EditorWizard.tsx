import React, { Dispatch, FC, SetStateAction } from 'react';
import ENode, { ENodeData } from '../../model/ENode';
import { Box, Accordion, AccordionDetails, AccordionSummary, Typography } from '@material-ui/core';
import { Constants } from 's-forms';
import useStyles from './EditorWizard.styles';
import {
  moveQuestion,
  removeBeingPrecedingQuestion,
  removeFromSubQuestions,
  removePrecedingQuestion,
  sortRelatedQuestions
} from '../../utils/formBuilder';
import ETree from '../../model/ETree';
import { cloneDeep } from 'lodash';
import EditorAdd from '@components/EditorAdd/EditorAdd';
import AddCircleIcon from '@material-ui/icons/AddCircle';

type Props = {
  question: ENodeData;
  buildFormUI: (question: ENodeData, position: number, parentQuestion: ENodeData) => JSX.Element;
  formStructure: ETree;
  setFormStructure: Dispatch<SetStateAction<ETree | undefined>>;
};

const EditorWizard: FC<Props> = ({ question, buildFormUI, formStructure, setFormStructure }) => {
  const classes = useStyles();

  const handleDragOver = (e: React.DragEvent<HTMLLIElement>) => {
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
    const newTree = cloneDeep(formStructure);

    const movingNode = newTree.structure.get(movingNodeId);
    const destinationPage = newTree.structure.get(destinationPageId);

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

    setFormStructure(newTree);
  };

  const addNewQuestion = (targetId: string) => {
    const newTree = cloneDeep(formStructure);

    const id = Math.floor(Math.random() * 10000) + 'editorwizard';

    // temporary
    const newQuestion = {
      '@id': id,
      '@type': 'http://onto.fel.cvut.cz/ontologies/documentation/question',
      'http://onto.fel.cvut.cz/ontologies/form-layout/has-layout-class': ['new'],
      'http://www.w3.org/2000/01/rdf-schema#label': id,
      'http://onto.fel.cvut.cz/ontologies/documentation/has_related_question': []
    };

    const targetNode = newTree.getNode(targetId);

    if (!targetNode) {
      console.error('Missing targetNode');
      return;
    }

    const node = new ENode(targetNode, newQuestion);

    newTree.addNode(newQuestion['@id'], node);

    moveQuestion(node, targetNode);

    targetNode.data[Constants.HAS_SUBQUESTION] = sortRelatedQuestions(targetNode.data[Constants.HAS_SUBQUESTION]);

    setFormStructure(newTree);
  };

  const relatedQuestions = question[Constants.HAS_SUBQUESTION];

  return (
    <React.Fragment>
      {relatedQuestions &&
        relatedQuestions.map((q) => (
          <Box
            key={q['@id']}
            id={q['@id']}
            className={classes.page}
            data-droppable={true}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Accordion expanded={true}>
              <AccordionSummary
                className={classes.header}
                // expandIcon={<ExpandMoreIcon />}
              >
                <Typography>{q[Constants.RDFS_LABEL]}</Typography>
                <AddCircleIcon fontSize={'large'} onClick={() => addNewQuestion(q['@id'])} />
              </AccordionSummary>
              <AccordionDetails className={classes.body}>
                <ol id={q['@id']}>
                  {q[Constants.HAS_SUBQUESTION]!.length > 0 && (
                    <EditorAdd
                      parentId={q['@id']}
                      position={0}
                      formStructure={formStructure}
                      setFormStructure={setFormStructure}
                    />
                  )}
                  {q[Constants.HAS_SUBQUESTION] &&
                    q[Constants.HAS_SUBQUESTION]!.map((question, index) => buildFormUI(question, index + 1, q))}
                </ol>
              </AccordionDetails>
            </Accordion>
          </Box>
        ))}
    </React.Fragment>
  );
};

export default EditorWizard;
