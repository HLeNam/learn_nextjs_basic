"use client";
import { useState } from "react";
import clsx from "clsx";

import "./card.css";
import custom from "./custom.module.scss";

const Card = () => {
    const [expanding, setExpanding] = useState(true);
    return (
        <div
            className={clsx("card", {
                [custom.card]: expanding,
            })}
        >
            Card
        </div>
    );
};
export default Card;
