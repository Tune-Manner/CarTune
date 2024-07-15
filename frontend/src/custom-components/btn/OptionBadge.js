const { Badge } = require("components/ui/badge");

function OptionBadge({optionName}) {
    return(
        <>
            <Badge variant="outline">{optionName}</Badge>
        </>
    );
}

export default OptionBadge;