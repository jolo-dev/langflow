import { useEffect, useState } from "react";

import {
  convertObjToArray,
  convertValuesToNumbers,
  hasDuplicateKeys,
} from "@/utils/reactflowUtils";
import { cloneDeep } from "lodash";
import IconComponent from "../../../genericIconComponent";
import { Input } from "../../../ui/input";
import { InputProps, KeyPairListComponentType } from "../../types";

export default function KeypairListComponent({
  value,
  handleOnNewValue,
  disabled,
  editNode = false,
  isList = true,
  id,
}: InputProps<
  object[] | object | string,
  KeyPairListComponentType
>): JSX.Element {
  useEffect(() => {
    if (disabled && value.length > 0 && value[0] !== "") {
      handleOnNewValue({ value: [{ "": "" }] }, { skipSnapshot: true });
    }
  }, [disabled]);

  const [duplicateKey, setDuplicateKey] = useState(false);

  const values =
    Object.keys(value || {})?.length === 0 || !value
      ? [{ "": "" }]
      : convertObjToArray(value, "dict");

  Array.isArray(value) ? value : [value];

  const handleNewValue = (newValue: any) => {
    const valueToNumbers = convertValuesToNumbers(newValue);
    setDuplicateKey(hasDuplicateKeys(valueToNumbers));
    if (isList) {
      handleOnNewValue({ value: valueToNumbers });
    } else handleOnNewValue({ value: valueToNumbers[0] });
  };

  const handleChangeKey = (event, idx) => {
    const oldKey = Object.keys(values[idx])[0];
    const updatedObj = { [event.target.value]: values[idx][oldKey] };

    const newValue = cloneDeep(values);
    newValue[idx] = updatedObj;

    handleNewValue(newValue);
  };

  const handleChangeValue = (event, idx) => {
    const key = Object.keys(values[idx])[0];
    const updatedObj = { [key]: event.target.value };

    const newValue = cloneDeep(values);
    newValue[idx] = updatedObj;

    handleNewValue(newValue);
  };

  const addNewKeyValuePair = () => {
    const newValues = cloneDeep(values);
    newValues.push({ "": "" });
    handleOnNewValue({ value: newValues });
  };

  const removeKeyValuePair = (index) => {
    const newValues = cloneDeep(values);
    newValues.splice(index, 1);
    handleOnNewValue({ value: newValues });
  };

  const getInputClassName = (isEditNode, isDuplicateKey) => {
    return `${isEditNode ? "input-edit-node" : ""} ${isDuplicateKey ? "input-invalid" : ""}`.trim();
  };

  const getTestId = (prefix, index) =>
    `${editNode ? "editNode" : ""}${prefix}${index}`;

  return (
    <div
      className={`flex h-full flex-col gap-3 ${values?.length > 1 && editNode ? "mx-2 my-1" : ""}`}
    >
      {values?.map((obj, index) =>
        Object.keys(obj).map((key, idx) => (
          <div key={idx} className="flex w-full gap-2">
            <Input
              data-testid={getTestId("keypair", index)}
              id={getTestId("keypair", index)}
              type="text"
              value={key.trim()}
              className={getInputClassName(editNode, duplicateKey)}
              placeholder="Type key..."
              onChange={(event) => handleChangeKey(event, index)}
            />

            <Input
              data-testid={getTestId("keypair", index + 100)}
              id={getTestId("keypair", index + 100)}
              type="text"
              disabled={disabled}
              value={obj[key]}
              className={editNode ? "input-edit-node" : ""}
              placeholder="Type a value..."
              onChange={(event) => handleChangeValue(event, index)}
            />

            {isList &&
              (index === values.length - 1 ? (
                <button
                  disabled={disabled}
                  onClick={addNewKeyValuePair}
                  id={getTestId("plusbtn", index)}
                  data-testid={id}
                >
                  <IconComponent
                    name="Plus"
                    className="h-4 w-4 hover:text-accent-foreground"
                  />
                </button>
              ) : (
                <button
                  onClick={() => removeKeyValuePair(index)}
                  data-testid={getTestId("minusbtn", index)}
                  id={getTestId("minusbtn", index)}
                >
                  <IconComponent
                    name="X"
                    className="h-4 w-4 hover:text-status-red"
                  />
                </button>
              ))}
          </div>
        )),
      )}
    </div>
  );
}