import styled from "styled-components";
import * as M from "@material-ui/core";
import * as P from '@material-ui/pickers';


export const Header = styled.div`
    font-size: 24px;
    font-weight: 300;
    padding: 20px 0 30px 0;
    color: ${(props) => props.theme.accent}
`;

export const TextField = styled(M.TextField).attrs(
    {
        "variant":"outlined",
        "fullWidth": true
    }
)`
    margin: 20px 0 !important;
`;

export const KeyboardDatePicker = styled(P.KeyboardDatePicker).attrs(
    {
        "variant": "inline",
        "format": "MM/dd/yyyy",
        "KeyboardButtonProps": {
            'aria-label': 'change date',
        },
        "fullWidth": true,
        "disableToolbar": true
    }
)`
    margin: 20px 0 !important;
`;

export const Button = styled(M.Button)`
    // margin: 10px 0 !important;
`;

export const Paper = styled(M.Paper)`
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    list-style: none;
    padding: 10px;
    margin: 15px 0;
`;

export const Chip = styled(M.Chip)`
    margin: 5px;
`;

export const SubmitButton = styled(M.Button).attrs({
    variant: "contained",
    color: "secondary"
})`
    margin: 15px 0 !important;
    padding: 15px 30px !important;
    font-weight: 800 !important;
`;