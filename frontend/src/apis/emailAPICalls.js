import { sendPlaylistSuccess } from "modules/EmailModules";
import { request } from "./api";
import axios from "axios";

export const callSendPlaylistAPI = ({ emailData }) => {

  return async (dispatch) => {
      try {
          const result = await axios.post('/playlist/send-email', emailData, {
              headers: {
                  'Content-Type': 'application/json',
              },
              'credentials': 'include'
          });
          console.log('emailData result : ', result)

          if (result.status === 200) {
              dispatch(sendPlaylistSuccess());
          }
      } catch (error) {
          console.error('There was an error!', error);
      }
  };

};