import React from "react";
import { Link } from "react-router-dom";

export const AddTableField = (props) => {
  return (
    <div className="field">
      <label className="label">{props.name}</label>
      <div className="field-body">
        <div className="field">
          <div className="control icons-left">
            {props.link ? (
              <Link to={props.link} className="link">
                {props.value}
              </Link>
            ) : (
              `${props.value}`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
