import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
 
function EmailInput() {

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
    </>
  )
}

export default EmailInput;