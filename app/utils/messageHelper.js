function composeErrorMessage(model) {
  let err = '';

  for (let key in model) {
    if (key !== 'statusCode') {
      if(!Array.isArray(model[key])) {
        err += `<p>${key}: ${model[key]}</p>`;
      }
    }
  }

  for (let key in model) {
    if (key !== 'statusCode') {
      if(Array.isArray(model[key])) {
        for (let i = 0; i < model[key].length; i++) {
          err += `<p>${key} ${model[key][i]}</p>`;        
        }
      }
    }
  }

  return err;
}

export { composeErrorMessage };
