import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { useNavigate } from "react-router-dom";
 
function EmailInput() {

  const navigate = useNavigate();

  return (
    <>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="email"
          placeholder="Email"
          style={{'borderRadius':'5px'}}
        />
        <Button
          type="submit"
          className="bg-white text-dark"
          style={{'borderRadius':'5px'}}
        >
          확인
        </Button>
      </div>
      <div
        className="text-start mt-3 w-[380px]"
        onClick={() => navigate(-1)}
      >
        〈&nbsp;메인으로
      </div>
    </>
  )
}

export default EmailInput;