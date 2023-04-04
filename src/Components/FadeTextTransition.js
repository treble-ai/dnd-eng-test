import React, { useState } from "react";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import useInterval from "../utils/CustomHooks/UseInterval";
import "./FadeTransition.scss";


const FadeTransition = (props) => (
    <CSSTransition
      {...props}
      classNames={{
        enter: "fade-enter",
        enterActive: "fade-enter-active",
        exit: "fade-exit"
      }}
      addEndListener={(node, done) => {
        node.addEventListener("transitionend", done, false);
      }}
    />
  );


function FadeTextTransition(props) {

    const [state, setState] = useState({
      discoverTextPosition: 0
    });

    const changeText = () => {
      setState({
        ...state, discoverTextPosition: (state.discoverTextPosition+1) % props.textsArray.length
      })
    }

    useInterval(changeText, 3000)
    
    const renderTexts = (text) => {
      {
        if(props.displayFunction){
          return props.displayFunction(text)
        }
        return text
      }
    }
  
    return (
      <div className={props.customClass}>
        <SwitchTransition mode={"out-in"}>
          <FadeTransition key={state.discoverTextPosition}>
            <div>
             {renderTexts(props.textsArray[state.discoverTextPosition])}
            </div>
          </FadeTransition>
        </SwitchTransition>
      </div>
    );
  }

export default FadeTextTransition;