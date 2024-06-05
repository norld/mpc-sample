import Upbond from "./embed/upbondEmbed.esm";
// import Upbond from "@upbond/upbond-embed";
import Web3 from "web3";
import Web3Token from "web3-token";
import { ethers } from "ethers";

class UpbondEmbed {
  // Initials
  upbond = null;

  web3 = null;

  // you can also using another envs.
  env = 'local';

  provider = null;

  isLoggedIn = false;

  initialized = false;

  whiteLabel = {
    walletTheme: {
      lang: "en",
      logo: "https://i.ibb.co/L6vHB5d/company-logo-sample.png",
      name: "Company",
      buttonLogo: "https://i.ibb.co/wBmybLc/company-button-logo-sample.png",
      isActive: true,
      modalColor: "#fffff",
      bgColor: "#4B68AE",
      bgColorHover: "#214999",
      textColor: "#f3f3f3",
      textColorHover: "#214999",
      upbondLogin: {
        globalBgColor: "#ffffff",
        globalTextColor: "#4B68AE"
      }
    }
  }

  networks = {
    host: "amoy",
    chainId: 80002,
    networkName: "amoy",
    blockExplorer: "https://mumbai.polygonscan.com/",
    ticker: "AMOY",
    tickerName: "AMOY",
    rpcUrl: "https://polygon-amoy.drpc.org"
  };

  constructor() {
    this.upbond = new Upbond({});
    this.web3 = new Web3();
    this.provider = null;
    this.idToken = null;
  }

  async init({ idToken }) {
    if (this.upbond instanceof Upbond) {
      await this.upbond.init({
        buildEnv: "local",
        network: this.networks,
        whiteLabel: this.whiteLabel,
        widgetConfig: {
          showAfterLoggedIn: true,
          showBeforeLoggedIn: true
        },
        state: idToken
      });
      console.log("UPBOND Embed initialized!");
      this.initialized = true;
      this.provider = upbondServices.upbond.provider;
      this.web3.setProvider(this.upbond.provider);
      // const accounts = await this.web3.eth.getAccounts();
      // await this.upbond.initiateTopup("moonpay", {});
      // console.log("@this.provider", accounts);
      // const test = await this.upbond.getMpcProvider();
      // console.log("@test", test);
      // console.log("@accounts", accounts);
      // const test = await this.signTransaction("test", accounts[0]);
      // console.log(test);
    }
  }

  async signTransaction(msg = "", account) {
    if (this.web3 instanceof Web3) {
      try {
        console.log("@this.upbond.provider", this.upbond.provider);
        this.web3.setProvider(this.upbond.provider);
        const sign = await this.web3.eth.sign(msg, account);
        return sign;
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  }

  async signWeb3Token(account) {
    try {
      const ether = new ethers.providers.Web3Provider(this.upbond.provider);
      const signer = await ether.getSigner();
      const sign = await Web3Token.sign(
        async (msg) => {
          if (this.web3 instanceof Web3) {
            return await signer.signMessage(msg, account);
          }
        },
        {
          expires_in: "3 days",
          expiration_time: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
          nonce: Math.ceil(Math.random() * 10)
        }
      );
      return sign;
    } catch (error) {
      console.error(error.message || "Some error occured");
      return;
    }
  }

  async sendTransaction(data) {
    try {
      console.log(data);
      this.web3.setProvider(this.upbond.provider);
      const accounts = await this.web3.eth.getAccounts();

      const tx = await this.web3.eth.sendTransaction(
        { from: accounts[0], to: data.to, value: data.value.toString() },
        function (err, transactionHash) {
          if (!err) return transactionHash;
        }
      );

      console.log("@data", tx);
      return tx;
    } catch (error) {
      console.error(error);
      toast.error(error.message || "Some error occured");
      return null;
    }
  }

  async getAccounts() {
    this.web3.setProvider(this.upbond.provider);
    const accounts = await this.web3.eth.getAccounts();
    console.log("@accounts", accounts);
    return accounts[0];
  }
}

const upbondServices = new UpbondEmbed();

export default upbondServices;
