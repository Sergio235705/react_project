import React, { useState, useRef } from 'react';
import {LanguageItalianContext} from '../Contexts/Contexts'
function LInguaTesto(props)
{
   return <>
    <LanguageItalianContext.Consumer >{(value) => (value ? 
        props.testoIT : props.testoEN)}</LanguageItalianContext.Consumer> </>
}

export default LInguaTesto
export {LInguaTesto}