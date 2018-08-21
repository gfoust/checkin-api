import { Dictionary } from '../../util';

export function validationError(err: any) {
  if (err.name === 'ValidationError') {
    const errors: Dictionary<string> = { };
    for (const prop in err.errors) {
      errors[prop] = err.errors[prop].message;
    }

    return {
      message: 'Request contained invalid data',
      errors,
    };
  }
  else if (err.name === 'MongoError' && err.code === 11000) {
    const match = err.message.match(/checkin\.\w+\s+index:\s*(\w+)_1\s+dup\s+key:\s*{\s*:\s*"(.*)"\s*}/);
    if (match) {
      return {
        message: 'Request contained invalid data',
        errors: {
          [match[1]]: `Path \`${match[1]}\` is not unique`,
        },
      };
    }
    else {
      return {
        message: 'Duplicate key error',
      };
    }
  }
}

export default validationError;
