import * as yup from 'yup'


export default class globalValidations{

    required = ()=>{
        return yup.string().required('This is mandatory.')
    }

    stringValidation = (min, max, onlyCharacters=false)=>{
        let schemaBuilder = yup.string();
        schemaBuilder = schemaBuilder.required('This is mandatory.').min(min,`Length must not be less than ${min} characters.`);
        if (max && max !== 0)
            schemaBuilder = schemaBuilder.max(max,`Length must not be greater than ${max} characters.`);
        if(onlyCharacters){
            schemaBuilder = schemaBuilder.matches(/^[A-z]+$/, 'Only alphabetic characters are allowed.')
        }
        return schemaBuilder;
    }

    numberValidation = (min, max, params)=>{
        let schemaBuilder = yup.number().typeError('Invalid number format.');
            schemaBuilder = schemaBuilder.required('This is mandatory.').min(min,`${params ? params : 'Number'} must be greater than or equal to ${min}.`);
        if (max && max !== 0)
            schemaBuilder = schemaBuilder.max(max,`${params ? params : 'Number'} must be less than or equal to ${max}.`);
        return schemaBuilder;
    }

    numberLengthValidation = (minLength, maxLength, params)=>{
        let schemaBuilder = yup.string().matches(/^[0-9]+$/, 'Invalid number format.');
        schemaBuilder = schemaBuilder.required('This is mandatory.').min( minLength , `${params} Number must be at least ${minLength} digits.`);
        if(maxLength && maxLength !== 0)
            schemaBuilder = schemaBuilder.max(maxLength, `${params} Number must not exceed ${maxLength} digits.`);
         return schemaBuilder;
    }

    selectValidation = ()=>{
        return yup.string().required('Please select an option.')
    }

    emailValidation =  ()=>{
        let schemaBuilder = yup.string().required('This is mandatory.').matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,'Invalid Email format.');
        return schemaBuilder
    }

    dateValidation = (required, min, max)=>{
        let schemaBuilder = yup.date();
        if(required)
            schemaBuilder = schemaBuilder.required('This is mandatory.');
        if (min !== null && min !== undefined)
            schemaBuilder = schemaBuilder.min(min,`Date should be after or equal to ${min}.`);
        if (max !== null && max !== undefined)
            schemaBuilder = schemaBuilder.max(max,`Date should be before or equal to than ${max}.`);
        return schemaBuilder;
    }
    
    
    
}