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
import { MemeForestAddress, Token, ApiUriv } from "../constant";
import { useEffect, useState } from "react";
import MEME from "../artifacts/contracts/Instaclone.sol/MemeForest.json";
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import { createClient } from "urql";
import { Web3Storage } from "web3.storage";
import { BsHeart, BsHeartFill } from "react-icons/bs";
import { FiDownloadCloud } from "react-icons/fi"
import {
  AiFillStar,
  AiOutlineHeart,
  AiFillHeart,
  AiOutlineCloudDownload,
} from "react-icons/ai";
import Footer from "../components/Footer";
import Loader from "../components/loader";

const MemesQuery = `
query {
    memes(
    orderBy : id,
    orderDirection: desc
        ) 
    {
        id
        MemeInfo
        Owner
        IsStarred
        Stars
        Likes
        Date
        FileType
        IsDownloadable
        StarredAddresses
        LikesAddresses
    }
}
`;

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

export default function Feed(props) {
  const Memeslength = props.memes.length;
  const { data } = useAccount();
  const person = data?.address;
  const [loadingStar, setLoadingStar] = useState(false);
  const [memberDetails, setMemberDetails] = useState([]);
  const [loadingLike, setLoadingLike] = useState(false);
  const [loadingLikeId, setLoadingLikeId] = useState(0);
  const [loadingStarId, setLoadingStarId] = useState(0);
  const provider = useProvider();
  const { data: signer } = useSigner();
  const [loadingpage, setLoadingPage] = useState(false);
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
    FechMemeInfo(props);
  }, []);

  const PageLoad = async () => {
    try {
      setLoadingPage(true);
      const delay = (ms) => new Promise((res) => setTimeout(res, ms));
      await delay(20000);
      setLoadingPage(false);
    } catch (e) {
      console.log(e);
    }
  };

  const StarMeme = async (id, bool) => {
    try {
      setLoadingStar(true);
      setLoadingStarId(id);
      if (bool == true) {
        const data = await contractWithSigner.RemoveStarMeme(id);
        await data.wait();
        await FechMemeInfo(props);
      } else {
        const data = await contractWithSigner.StarMeme(id);
        await data.wait();
        await FechMemeInfo(props);
      }
      setLoadingStar(false);
    } catch (e) {
      console.log(e);
    }
  };
  const download = (e, name) => {
    try {
      const Link = `https://${e}.ipfs.dweb.link/image`;
      axios({
        url: Link, //your url
        method: "GET",
        responseType: "blob", // important
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", name + ".png");
        document.body.appendChild(link);
        link.click();
      });
    } catch (error) {
      console.log(error);
    }
  };
  const LikeMeme = async (id, bool) => {
    try {
      setLoadingLike(true);
      setLoadingLikeId(id);
      if (bool == true) {
        const data = await contractWithSigner.UnLikeMeme(id);
        await data.wait();
        await FechMemeInfo(props);
      } else {
        const data = await contractWithSigner.LikeMeme(id);
        await data.wait();
        await FechMemeInfo(props);
      }
      setLoadingLike(false);
    } catch (e) {
      console.log(e);
    }
  };
  function getAccessToken() {
    return Token;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }
  const FechMemeInfo = async (props) => {
    const client = makeStorageClient();
    let data = props.memes;
    const tx = await Promise.all(
      data.map(async (i) => {
        const res = await client.get(i.MemeInfo);
        if (!res.ok) {
          return;
        }

        const StarAnswer = signer
          ? await contractWithProvider.WhatDidIStar(i.id, person)
          : false;
        const LikeAnswer = signer
          ? await contractWithProvider.WhatDidILike(i.id, person)
          : false;

        let files = await res.files();
        const info = await axios.get(`https://${files[0].cid}.ipfs.dweb.link`);
        let List = {
          Name: info.data.nameOfFile,
          Description: info.data.DescriptionOfFile,
          image: info.data.image,
          Owner: i.Owner,
          IsStarred: i.IsStarred,
          NumberOfStars: i.Stars,
          NumberOfLikes: i.Likes,
          Date: i.Date,
          Id: i.id,
          IsDownloadable: i.IsDownloadable,
          FileType: i.FileType,
          DidMemberStarMe: StarAnswer,
          DidMemberLikeMe: LikeAnswer,
        };
        return List;
      })
    );
    setMemberDetails(tx);
  };


  const renderButton = () => {
    if (Memeslength == 0) {
      return (
        <div className="flex flex-row items-center justify-center">
          {loadingpage ? (
            <div className="text-center text-8xl">
              <Loader/>
            </div>
          ) : (
            <h4 className="text-center">There are no Memes For Display</h4>
          )}
        </div>
      );
    }
    if (Memeslength > 0) {
      return (
        <>
          {loadingpage ? (
            <div className="flex flex-row items-center justify-center">
              <div className="text-center text-8xl">
                <Loader/>
              </div>
            </div>
          ) : (
            <div className="my-feed-layout">
              {memberDetails.map((card, i) => {
                return (
                  <div
                    key={i}
                    className="w-full shadow-md my-2 bg-gray-50 reaction-container "
                  >
                    {
                      <div className="flex flex-col">
                        <div className="group flex flex-row items-center justify-center overflow-hidden ">
                          <a href={card.File} target="_blank" rel="noreferrer">
                            {card.FileType == "img/png" ? (
                              <img
                                src={`https://${card.image}.ipfs.dweb.link/image`}
                                className="w-full"
                                alt="..."
                              />
                            ) : (
                              <video
                                src={`https://${card.image}.ipfs.dweb.link/image`}
                                className="w-full rounded-lg h-36 group-hover:scale-150 transition ease duration-300"
                                alt="..."
                                width="500px"
                                height="500px"
                                controls="controls"
                              />
                            )}
                          </a>
                          <div className=" hidden p-1 rounded-lg bg-gray-700 text-gray-100 font-medium text-xs group-hover:inline absolute self-start  ">
                            {props.members.map((lists, i) => {
                              return (
                                <div key={i}>
                                  {lists.Adddress == card.Owner && (
                                    <div>{lists.Name}</div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          <div className="hidden p-1 rounded-lg bg-gray-700 text-gray-100 font-thin text-xs group-hover:inline absolute self-end">
                            {card.Date}
                          </div>
                        </div>
                        <div className=" h-auto ">
                          <div className="reaction-button  ">
                            <div className="likes-button">
                              <button
                                className="rounded-md border-none flex mt-3  items-center justify-around h-8 w-10  "
                                onClick={() =>
                                  StarMeme(card.Id, card.DidMemberStarMe)
                                }
                              >
                                {loadingStarId == card.Id && loadingStar ? (
                                  <button className="bg-[#FFFF00] rounded-md flex items-center justify-around h-7 w-24">
                                    <h4>
                                      <BsHeart className="hover:text-[#FFFF00]" />
                                    </h4>
                                  </button>
                                ) : card.DidMemberStarMe == true ? (
                                  <>
                                    <BsHeartFill className="hover:text-[#FFFF00]" />
                                    {card.NumberOfStars}
                                  </>
                                ) : (
                                  <>
                                    <BsHeart className="hover:text-[#FFFF00]" />
                                    {card.NumberOfStars}
                                  </>
                                )}
                              </button>
                              <button
                                className="rounded-md border-none flex mt-3  items-center justify-around h-8 w-10  "
                                onClick={() =>
                                  LikeMeme(card.Id, card.DidMemberLikeMe)
                                }
                              >
                                {loadingLikeId == card.Id && loadingLike ? (
                                  <button className="rounded-md border-none flex  items-center justify-around h-8 w-10 bg-[#FFFF00] ">
                                    <h4>
                                      <AiFillStar className="hover:text-[#ff0000]" />
                                    </h4>
                                  </button>
                                ) : card.DidMemberLikeMe == true ? (
                                  <>
                                    <AiFillHeart className="hover:text-[#ff0000]" />
                                    {card.NumberOfLikes}
                                  </>
                                ) : (
                                  <>
                                    <AiOutlineHeart className="hover:text-[#ff0000]" />
                                    {card.NumberOfLikes}
                                  </>
                                )}
                              </button>
                              <button className="rounded-md border-none flex mt-3  items-center justify-around h-8 w-10  ">
                                {card.IsDownloadable ? (
                                  <div className="text-gray-100 flex  items-center justify-around h-8 w-24 ">
                                    <a
                                      href={`https://${card.image}.ipfs.dweb.link/image`}
                                      download
                                      target="_blank"
                                      rel="noreferrer"
                                      onClick={(e) =>
                                        download(card.image, card.Name)
                                      }
                                    >
                                      <FiDownloadCloud />
                                    </a>
                                  </div>
                                ) : (
                                  <div className="row-start-2 h-10 row-span-2 flex items-center justify-center rounded-lg py-2 "></div>
                                )}
                              </button>
                            </div>
                          </div>

                          <div className="post-details">
                            <div>
                              {card.Name.length > 7 ? (
                                <div className="flex items-end row-start-2 row-span-2 rounded-lg font-black text-xs  ">
                                  {card.Name}
                                </div>
                              ) : (
                                <div className="flex items-end row-start-2 row-span-2 rounded-lg font-black text-sm  ">
                                  {card.Name}
                                </div>
                              )}
                            </div>
                            <div className="rounded-md mt-3 text-sm h-auto ">
                              {card.Description}
                            </div>
                          </div>

                          <div className="reaction-button"></div>
                        </div>
                      </div>
                    }
                  </div>
                );
              })}
            </div>
          )}
        </>
      );
    }
  };

  return (
    <div>
      <Head>
        <title>Home</title>
        <meta name="description" content="By wisdom" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="main">
        <div className="layout">{renderButton()}</div>
        <div className="flex flex-col items-center pt-3 px-2">
          <div className="py-4">
          <ConnectButton />
          </div>
          <Footer/>
        </div>
      </div>
    </div>
  );
}

async function GetData() {
  const data = await client.query(MemesQuery).toPromise();
  return data.data.memes;
}
async function MemInfo() {
  const info = await client.query(MemberQuery).toPromise();
  return info.data.memebers;
}

export async function getServerSideProps() {
  const data = await GetData();
  const info = await MemInfo();
  return {
    props: {
      memes: data,
      members: info,
    },
  };
}
