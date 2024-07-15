import { Button } from "components/ui/button";
function SearchBtn({ buttonTitle, onClick }) {
    
    return(
        <>
            <Button
                variant="outline"
                className="w-[300px] bg-tune text-tune-foreground"
                style={{'borderRadius':'5px'}}
                onClick={onClick} // props로 넘어온 onClick 실행
            >
                {/* props로 넘어온 버튼 타이틀 표시 */}
                {buttonTitle} 
            </Button>
        </>
    );
}

export default SearchBtn;