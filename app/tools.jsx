import React from "react";
import { Link } from "react-router-dom";

const Paginate = (props) => {
    const pages = props.pages;
    const page = props.page;
    const setPage = props.setPage;
    const maxPages = 7;
    const marginPages = 3;

    return (
        <div class="table-pagination">
            <div class="flex items-center justify-between">
                {pages > 1 ? (
                    <div class="buttons">
                        {[...Array(pages)].map((p, index) => {
                            const bc = `button${index + 1 == page ? " active" : ""}`;
                            if (index == 0) {
                                return (
                                    <button type="button" onClick={() => setPage(1)} class={bc}>
                                        1
                                    </button>
                                );
                            }
                            if (index + 1 >= page - marginPages) {
                                if (index + 1 == pages) {
                                    return (
                                        <button type="button" onClick={() => setPage(pages)} class={bc}>
                                            {pages}
                                        </button>
                                    );
                                }
                                if (index + 1 < maxPages + page || index + 1 > pages - 2) {
                                    return (
                                        <button type="button" onClick={() => setPage(index + 1)} class={bc}>
                                            {" "}
                                            {index + 1}
                                        </button>
                                    );
                                } else {
                                    if (index + 1 == pages - 3) return <button type="button">...</button>;
                                }
                            }
                        })}
                    </div>
                ) : (
                    false
                )}
                <small>
                    Page {page} of {pages}
                </small>
            </div>
        </div>
    );
};

const AddTableField = (props) => {
    return (
        <div class="field">
            <label class="label">{props.name}</label>
            <div class="field-body">
                <div class="field">
                    <div class="control icons-left">
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

export { Paginate, AddTableField };
