import React from "react";
import css from "./Select.module.css";

function Select(props) {
    return (
        <div className={css.container}>
            <select
                name="type"
                id="type"
                onChange={(e) => props.onChange(e.target.value)}
            >
                place
                {props.items.map((item) => (
                    <option className={css.option} key={item.id} value={item.value}>
                        {item.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export default Select;
