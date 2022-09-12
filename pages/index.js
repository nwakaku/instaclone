import Head from "next/head";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import {
  useContract,
  useProvider,
  useSigner,
  useAccount,
  useBalance,
  useConnect,
} from "wagmi";
import { MemeForestAddress, ApiUriv } from "../constant";
import { useEffect, useState } from "react";
import MEME from "../artifacts/contracts/Instaclone.sol/MemeForest.json";
import { createClient } from "urql";
import {instagram} from './assets/instagram.png';
import Footer from '../components/Footer'

const MemberQuery = `
query {
  memebers{
    Name
    Adddress
    TotalMeme
    StarredMemes
    Date
  }
}
`;

const client = createClient({
  url: ApiUriv,
});

export default function Home(props) {
  const { data } = useAccount();
  const person = data?.address;
  const [name, setName] = useState("");
  const [Address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [AMember, setAMember] = useState(false);
  const [loadingpage, setLoadingPage] = useState(false);
  const provider = useProvider();
  const { data: signer } = useSigner();
  const contractWithSigner = useContract({
    addressOrName: MemeForestAddress,
    contractInterface: MEME.abi,
    signerOrProvider: signer,
  });

  const contractWithProvider = useContract({
    addressOrName: MemeForestAddress,
    contractInterface: MEME.abi,
    signerOrProvider: provider,
  });
  useEffect(() => {
    PageLoad();
    checkIfAMember(props);
  }, [ ]);

  const [loadNext, setLoadNext] = useState(false)

  const PageLoad = async () => {
    try {
      setLoadingPage(true);
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(7000);
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  };
  const joinMembership = async () => {
    try {
      setLoading(true);
      let _time = new Date().toLocaleString();
      if (!name) {
        alert("Name is not there");
      }
      const join = await contractWithSigner.CreateMembers(name, _time);
      await join.wait();
      setLoading(false);
      setAMember(true);
      checkIfAMember(props);
    } catch (w) {
      console.log(w);
    }
  };
  const checkIfAMember = async (props) => {
    try {
      let data = props.members;
      const addresses = [""];
      const tx = await Promise.all(
        data.map(async (i) => {
          addresses.push(i.Adddress);
          return addresses;
        })
      );
      const Address = person.toLowerCase();
      setAddress(Address);
      const isThere = addresses.includes(Address);
      setAMember(isThere);
    } catch (e) {
      console.log(e);
      setAMember(false);
    }
  };

  const renderButton = () => {
    if (!AMember) {
      return (
        <div className="">
          <div className="insta-landing">
            <div className=" w-full image-tag">
              <img
                src="https://25394076.fs1.hubspotusercontent-eu1.net/hub/25394076/hubfs/instadevice.png?width=600&height=450&name=instadevice.png"
                className="w-full"
              />
            </div>
            <div>
              <div className="instaclone-login ">
                <div className="">
                  <h2 className="logo">InstaClone</h2>
                
                </div>
                <div className=" ">
                  Register to become a Member
                </div>
                <div className="">
                  <input
                    className=" "
                    placeholder="Enter your Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="">
                  {loading ? (
                    <button className=" ">
                      <img
                        src="/loader.png"
                        alt="loading..."
                        className=""
                      />
                    </button>
                  ) : (
                    <button
                      className=""
                      onClick={joinMembership}
                    >
                      Register
                    </button>
                  )}

                  <p className="">
                    {" "}
                    ------------OR------------
                  </p>
                  <div className=" " onClick={() => setLoadNext(!loadNext)}>
                    <ConnectButton chainStatus="none"  />
                  </div>
                </div>
              </div>
              <div className="instaclone-pic">
                <p>Get The App</p>
                <div className="footer-image ">
                  <img className="" src="https://www.kindpng.com/picc/m/790-7908713_download-from-app-store-icons-png-transparent-png.png" />
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (AMember) {
      return (
        <div>
          <div className="text-lg font-semibold w-full">
            {props.members.map((lists, i) => {
              return (
                <div key={i} className="text-lg font-semibold">
                  {lists.Adddress == Address && (
                    <div className="account">
                      <div>
                        <div className="border-b-2 border-gray-300 w-full">
                          <div className="flex flex-col items-center w-full">
                            <div className=" flex flex-col md:flex-row items-center w-full">
                              <div className="account-inner">
                                <img
                                  className="w-full rounded-full"
                                  src="https://imgs.search.brave.com/ZMmr6JQ2gf6YBMFp4tfHzvjmvuNy-YRR0QIIKseo60w/rs:fit:1110:1069:1/g:ce/aHR0cHM6Ly9pLmVi/YXlpbWcuY29tL2lt/YWdlcy9nL3lrb0FB/T1N3d2cxZ3R0NEMv/cy1sMTYwMC5wbmc"
                                />
                                <div>
                                    <h3>
                                      <span className="pb-2 pr-5 text-3xl  text-gray border-b border-white">
                                        {lists.Name}
                                      </span>
                                    </h3>
                                  </div>
                              </div>
                              <div className="flex flex-col justify-between w-full basis-4/5 space-y-6 p-10 mr-4 ">
                                <div className=" flex items-center justify-between   font-semibold hover:cursor-pointer ">
                                  

                                  <div className="text-sm ">
                                    <ConnectButton />
                                    <div className="py-2">
                                      <span>Address Owner:</span>
                                      {lists.Adddress}
                                    </div>
                                    <div>
                                      <span>Date Joined:</span>
                                      {lists.date}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col items-center w-full p-10">
                          <div className="flex flex-col md:flex-row justify-between space-y-6 md:space-x-6 md:space-y-0  hover:cursor-pointer">
                            <div className="flex flex-col  items-center p-10  text-orange-500 hover:bg-gray-50 rounded-lg border-2 border-green-400">
                              <span className="font-medium ">
                                {" "}
                                Number Of Starred Memes
                              </span>
                              <span className="font-normal">
                                {" "}
                                {lists.StarredMemes}
                              </span>
                            </div>
                            <div className="flex flex-col  items-center p-10  text-orange-500 hover:bg-gray-50 rounded-lg border-2 border-green-400">
                              <span className="font-medium">
                                {" "}
                                Number Of Total Memes
                              </span>
                              <span className="font-normal">
                                {" "}
                                {lists.TotalMeme}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="description" content="By Oleanji" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
      {renderButton()}
      <Footer/>
      
      </div>
    </div>
  );
}

async function GetData() {
  const data = await client.query(MemberQuery).toPromise();
  return data.data.memebers;
}

export async function getServerSideProps() {
  const data = await GetData();
  return {
    props: {
      members: data,
    },
  };
}
