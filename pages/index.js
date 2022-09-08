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
import {instagram} from './assets/instagram.png'

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
  }, []);

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
        <div className="flex items-center w-full h-full  z-0">
          <div className=" flex flex-col-reverse md:flex-row items-center md:justify-center w-full h-full px-10 ">
            <div className="w-full flex items-center justify-center md:justify-around basis-2/5 md:ml-4  md:mt-0">
              <img
                src="https://25394076.fs1.hubspotusercontent-eu1.net/hub/25394076/hubfs/instadevice.png?width=600&height=450&name=instadevice.png"
                className="w-full"
              />
            </div>
            <div>
              <div className="instaclone-login ">
                <div className="flex items-center text-3xl text-center text-black font-bold my-2">
                  <span className="logo">InstaClone</span>
                </div>
                <div className="text-sm text-gray-400 my-2 ">
                  Register to become a Member
                </div>
                <div className="pt-2 w-full my-2">
                  <input
                    className="px-2 py-1 h-10 font-semibold text-sm w-full border rounded-xl "
                    placeholder="Enter your Name"
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="flex flex-col items-center  justify-center w-full my-2">
                  {loading ? (
                    <button className="text-lg text-gray-50 flex items-center justify-center font-semibold w-full py-2 bg-white  rounded-xl ">
                      <img
                        src="/loader.png"
                        alt="loading..."
                        className="w-8 h-8 mt-2"
                      />
                    </button>
                  ) : (
                    <button
                      className="text-lg text-gray-50  font-semibold w-full py-2 bg-green-500 hover:bg-gray-50 hover:text-green-500 border hover:border-slate-100 rounded-xl"
                      onClick={joinMembership}
                    >
                      Register
                    </button>
                  )}

                  <span className="text-sm text-gray-400 pt-1">
                    {" "}
                    ------------OR------------
                  </span>
                  <div className=" text-gray-50 text-xs pt-3 flex items-center justify-center">
                    <ConnectButton />
                  </div>
                </div>
              </div>
              <div className="instaclone-pic my-2">
                <p>Get The App</p>
                <div className="footer-image ">
                  <img className="w-full" src="https://www.kindpng.com/picc/m/790-7908713_download-from-app-store-icons-png-transparent-png.png" />
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
                                  src="https://media-exp1.licdn.com/dms/image/C4D03AQFRtWy9qsNbNw/profile-displayphoto-shrink_800_800/0/1643435491540?e=2147483647&v=beta&t=BMkL1vBXx1W2mT_CtF3Ut0f-9mZjL69GiXMHAVsIEi8"
                                />
                              </div>
                              <div className="flex flex-col justify-between w-full basis-4/5 space-y-6 p-10 mr-4 ">
                                <div className=" flex items-center justify-between   font-semibold hover:cursor-pointer ">
                                  <div>
                                    <h3>
                                      <span className="pb-2 pr-5 text-3xl  text-gray border-b border-white">
                                        {lists.Name}
                                      </span>
                                    </h3>
                                  </div>

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
      {renderButton()}
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
