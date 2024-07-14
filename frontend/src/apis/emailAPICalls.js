import { sendPlaylistSuccess } from "modules/EmailModules";
import { request } from "./api";

export const callSendPlaylistAPI = ({ emailData }) => {

  return async (dispatch) => {
      try {
          const result = await request ('POST', '/playlist/send-email', emailData); 

          if (result.status === 200) {
              dispatch(sendPlaylistSuccess());
          }
        } catch (error) {
            console.error('There was an error!', error);
    }
  };
};