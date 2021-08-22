/**
 * @title: ChatDisplay.jsx
 * @author: Javier Olaya
 * @date: 8/19/2021
 * @description: main componet that displays all the messages
 */
const ChatDisplay = ({ userNa, messages }) => {
  return (
    <div>
      <section className="chat-window-wrapper">
        <div className="chat-window">
          {messages.map((message, index) => {
            const newClassName =
              message.userName === userNa
                ? 'chat-bubble-left'
                : 'chat-bubble-right';
            return (
              <section className={newClassName} key={'message-' + index}>
                <div className={'chat-bubble-fill'}>{message.content}</div>
                <div>
                  {message.userName + ' '}
                  {message.timeStamp}
                </div>
              </section>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default ChatDisplay;
