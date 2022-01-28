import {useState} from "react";
import {Container, Spinner, Form, Button} from 'react-bootstrap';
import alert from "bootstrap/js/src/alert";
import {ethers} from "ethers";
import {getAuth, getEtherPriceToStr} from "../utils";
import {NFT_TRADER_ADDRESS} from "../const";
import NftTrader from "../abis/NftTrader.json";

// @author Hosokawa-zen
function WithdrawRoyalty() {
    const [processing, setProcessing] = useState(false);

    const onWithdraw = async () => {
        if (typeof window.ethereum !== 'undefined') {
            try {
                setProcessing(true);
                const {account, signer} = await getAuth();

                const traderContract = new ethers.Contract(NFT_TRADER_ADDRESS, NftTrader.abi, signer);
                // Mint
                let transaction = await traderContract.claimRoyalty(account);
                const rsx = await transaction.wait();
                const event = rsx.events.find(e => e.event === 'ClaimRoyalty');
                if (event) {
                    const {destAddr, amount} = event.args;
                    console.log('transaction, result', event.args, destAddr, amount);
                    window.alert(`You withdraw ${getEtherPriceToStr(amount)} BNB!`);
                }
                setProcessing(false);
            } catch (e) {
                console.log('error', e);
                window.alert(`No Balance!`);
                setProcessing(false);
            }
        }
    }

    return (
        <div className="App">
            <Container>
                <h1>Withdraw Royalty</h1>
                <p>Nft sellers and SIOs can withdraw their royalty balance</p>
                {
                    processing ? <Spinner animation="border"/>
                        :
                        <Button className="mt-5" variant="primary" onClick={onWithdraw}>Withdraw Royalty</Button>
                }
            </Container>
        </div>
    )
}

export default WithdrawRoyalty;