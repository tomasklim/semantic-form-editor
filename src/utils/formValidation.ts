import { JsonLdObj } from 'jsonld/jsonld-spec';
import { Readable } from 'stream';
// @ts-ignore
import SHACLValidator from 'rdf-validate-shacl';
// @ts-ignore
import factory from 'rdf-ext';
// @ts-ignore
import ParserN3 from '@rdfjs/parser-n3';
// @ts-ignore
import ParserJsonld from '@rdfjs/parser-jsonld';
import { ValidationError } from '@contexts/ValidationContext';

export const shaclFormValidation = async (form: JsonLdObj): Promise<[boolean, Map<string, ValidationError>]> => {
  const parserTTL = new ParserN3({ factory });
  const parserJsonLd = new ParserJsonld();

  const validationShapes = require('@data/validation.shapes.ttl');

  const inputTTL = new Readable({
    read: () => {
      inputTTL.push(validationShapes.default);
      inputTTL.push(null);
    }
  });

  const inputJsonLd = new Readable({
    read: () => {
      inputJsonLd.push(JSON.stringify(form));
      inputJsonLd.push(null);
    }
  });

  const outputTTL = parserTTL.import(inputTTL);

  const outputJsonLd = parserJsonLd.import(inputJsonLd);

  const shapesTTL = await factory.dataset().import(outputTTL);
  const data = await factory.dataset().import(outputJsonLd);

  const validator = new SHACLValidator(shapesTTL, { factory });

  const report = await validator.validate(data);

  const isValid = report.conforms;

  const validationResults = new Map();

  for (const result of report.results) {
    const attribute = result.path.value;
    const questionId = result.focusNode.value;
    const error = result.message[0].value;

    const errorRecord = { attribute, error };
    if (validationResults.has(questionId)) {
      validationResults.get(questionId).push(errorRecord);
    } else {
      validationResults.set(questionId, [errorRecord]);
    }
  }

  return [isValid, validationResults];
};
