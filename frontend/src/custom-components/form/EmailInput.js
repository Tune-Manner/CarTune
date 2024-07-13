import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { useState } from "react";

function EmailInput({ inputClassName, buttonClassName, inputOnChange, buttonOnClick }) {
  
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    buttonOnClick(email); // 이메일 값만 전달
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        style={{ borderRadius: '5px' }}
        className={inputClassName}
        onChange={(e) => {
          setEmail(e.target.value);
          inputOnChange(e); // 입력 값 업데이트
        }}
      />
      <Button
        type="submit"
        className={buttonClassName}
        variant="outline"
        style={{ borderRadius: '5px' }}
      >
        확인
      </Button>
    </form>
  );
}

export default EmailInput;
