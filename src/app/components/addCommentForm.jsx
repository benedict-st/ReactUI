import React, { useEffect, useState } from "react";
import api from "../api";
import { validator } from "../utils/validator";
import SelectField from "./common/form/selectField";
import TextAreaField from "./common/form/textAreaField";
import PropTypes from "prop-types";
export default function addCommentForm({ onSubmit }) {
    const initialData = { userId: "", content: "" };
    const [data, setData] = useState(initialData);

    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState();
    const [errors, setErrors] = useState({});
    useEffect(() => {
        api.users.fetchAll().then(setUsers);
    }, []);
    useEffect(() => {
        if (typeof users !== "undefined") {
            setIsLoading(true);
        }
    }, [users]);
    const usersList =
        users &&
        Object.keys(users).map((userId) => ({
            label: users[userId].name,
            value: users[userId]._id
        }));

    const handleChange = (target) => {
        setData((prevState) => ({
            ...prevState,
            [target.name]: target.value
        }));
    };
    const clearForm = () => {
        setData(initialData);
        setErrors({});
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const isValid = validate();
        if (!isValid) return;
        onSubmit(data);
        clearForm();
    };
    const validatorConfig = {
        content: {
            isRequired: {
                message: "Комментарий обязателен для заполнения"
            }
        },
        _id: {
            isRequired: {
                message: "Обязательно выберите пользователя"
            }
        }
    };
    useEffect(() => {
        validate();
    }, [data]);
    const validate = () => {
        const errors = validator(data, validatorConfig);
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    return (
        <div>
            {isLoading && Object.keys(users).length > 0 ? (
                <form onSubmit={handleSubmit}>
                    <SelectField
                        label="Выбери пользователя"
                        options={usersList}
                        name="userId"
                        onChange={handleChange}
                        value={data.userId}
                        defaultOption="Выберите пользователя"
                        error={errors.userId}
                    />

                    <TextAreaField
                        label="Комментарий"
                        name="content"
                        value={data.content}
                        onChange={handleChange}
                        error={errors.content}
                    />
                    <div className="d-flex justify-content-end">
                        <button className="btn btn-primary">
                            Опубликовать
                        </button>
                    </div>
                </form>
            ) : (
                "Loading..."
            )}
        </div>
    );
}
addCommentForm.propTypes = {
    onSubmit: PropTypes.func
};
