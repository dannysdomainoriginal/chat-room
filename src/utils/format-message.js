import moment from "moment";

const formatMessage = (username, text, room) => {
  return {
    username,
    text,
    time: moment().format("h:mm a"),
    room
  };
};

export default formatMessage;
