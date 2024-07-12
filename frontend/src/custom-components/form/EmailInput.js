import { Button } from "components/ui/button";
import { Input } from "components/ui/input";
import { useState } from "react";
 
function EmailInput({ onEmailSubmit, className, fontStyle }) {

  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onEmailSubmit(email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ borderRadius: '5px' }}
        className={`${fontStyle}`}
      />
      <Button
        type="submit"
        className={`${className}`}
        variant="outline"
        style={{ borderRadius: '5px' }}
      >
        확인
      </Button>
    </form>
  );
}

export default EmailInput;