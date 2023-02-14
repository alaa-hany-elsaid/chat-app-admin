import { Checkbox, Label, Modal, Radio, Spinner } from "flowbite-react";
import React, { useState } from "react";

export function UserActionsModal({
  socket,
  show = false,
  onClose = () => {},
  user,
  chatId,
}) {
  const [isBlocked, setIsBlocked] = useState(user.status === "blocked");
  const [isSuspend, setIsSuspend] = useState(user.status === "suspend");
  const [isActive, setIsActive] = useState(user.status === "active");
  const [isLoading, setIsLoading] = useState(false);

  const changeState = (data, onRes = () => {}) => {
    setIsLoading(true);
    socket.emit("action", data, (res) => {
      onRes(res);
      setIsLoading(false);
    });
  };

  return (
    <Modal
      show={show}
      size="2xl"
      onClose={() => {
        onClose(isBlocked ? "blocked" : isSuspend ? "suspend" : "active");
      }}
    >
      <Modal.Header>{user.firstName + " " + user.lastName}</Modal.Header>
      <Modal.Body>
        {isLoading ? (
          <div className="flex justify-center h-[10rem] items-center">
            <Spinner aria-label="Center-aligned Loading spinner" size="xl" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <Radio
                id="block-status"
                name="status"
                value="blocked"
                defaultChecked={isBlocked}
                onChange={(e) => {
                  changeState(
                    {
                      name: "blocked",
                      userId: user.id,
                      chatId,
                    },
                    () => {
                      setIsBlocked(true);
                      setIsSuspend(false);
                      setIsActive(false);
                    }
                  );
                }}
              />
              <Label htmlFor="block-status">Block</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="suspend-status"
                name="status"
                value="suspend"
                defaultChecked={isSuspend}
                onChange={(e) => {
                  changeState(
                    {
                      name: "suspend",
                      userId: user.id,
                      chatId,
                    },
                    () => {
                      setIsSuspend(true);
                      setIsBlocked(false);
                      setIsActive(false);
                    }
                  );
                }}
              />
              <Label htmlFor="suspend-status">Suspend</Label>
            </div>
            <div className="flex items-center gap-2">
              <Radio
                id="active-status"
                name="status"
                value="active"
                defaultChecked={isActive}
                onChange={(e) => {
                  changeState(
                    {
                      name: "unblocked",
                      userId: user.id,
                      chatId,
                    },
                    () => {
                      setIsActive(true);
                      setIsSuspend(false);
                      setIsBlocked(false);
                    }
                  );
                }}
              />
              <Label htmlFor="active-status">Active</Label>
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
}
