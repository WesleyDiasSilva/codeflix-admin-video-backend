import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldsError } from "../../domain/validators/validator-fields-interface";

type Expected = | 
{
  validator: ClassValidatorFields<any>;
  data: any}
| (() => any)

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldsError){
    if (typeof expected === 'function'){
      try {
        expected()
        return isValid();
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorMessage(error.errors, received)
      }
    } else {
      const {data, validator} = expected;
      const validated = validator.validate(data);

      if(validated) {
        return isValid();
      }

      return assertContainsErrorMessage(validator.errors, received)
    }
  }
})



function assertContainsErrorMessage(
  expected: FieldsError,
  received: FieldsError
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? {pass: true, message: () => 'Erro na expected personalizada'}
    : {
      pass: false,
      message: () =>
        `The validation errors no contains ${JSON.stringify(received)}, Current: ${JSON.stringify(expected)}`,
    }
}

function isValid(){
  return {
    message: () => 'Erro na expected personalizada',
    pass: true
  }
}
