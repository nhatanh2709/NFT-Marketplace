import Identicon from 'react-identicons'
import { use } from 'chai'
import React from 'react'
import { useState } from 'react'
import {FaTimes} from 'react-icons/fa'
import { setGlobalState,setLoadingMsg,truncate,useGlobalState } from '../store'

const imgHero = "https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg" 

const ShowNFT = () => {
    const [connectedAccount] = useGlobalState('connectedAccount')
    const [modal] = useGlobalState('showModal')
    const [nft] = useGlobalState('nft')
    const onChangePrice = () => {
        setGlobalState('nft',nft)
        setGlobalState('showModal','scale-0')
        setGlobalState('updateModal','scale-100')
    }

    const handleNFTPurchase = async () => {
    
        try {
        setLoadingMsg('Purchasing, awaiting Metamask approval...')
        await buyNFT(nft)
        setAlert('Transfer completed...', 'green')
        window.location.reload()
        } 
        catch (error) {
        console.log('Error transfering NFT: ', error)
        setAlert('Purchase failed...', 'red')
        }      
    }
    
    const closeModal = () =>{
        setGlobalState('showModal', 'scale-0')
        
    }
    
  return (
    <div 
    className={`fixed top-0 left-0 w-screen h-screen flex items-center
    justify-center bg-black bg-opacity-50 transform
    transition-transform duration-300 ${modal}`}
    >
        <div 
        className="bg-[#151c25] shadow-xl shadow-[#e32970]
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
        >
        <div className="flex flex-col">
            <div className="flex flex-row justify-between items-center text-gray-400">
                <p className="font-semibold ">Buy NFT</p>
                <button 
                type="button" 
                onClick={closeModal}
                className="border-0 bg-transparent focus:outline-none">
                    <FaTimes/>
                </button>
            </div>
            <div className="flex flex-row justify-center items-center rounded-xl mt-5">
                <div className="shrink-0 rounded-xl overflow-hidden h-40 w-40">
                    <img 
                    className="h-full w-full object-cover cursor-pointer"
                    src={nft?.metadataURI}
                    alt={nft?.title}
                    />
                </div>
            </div>
            <div className="flex flex-col justify-start rounded-xl mt-5">
                <h4 className="text-white font-semibold">{nft?.title}</h4>
                <p className="text-gray-400 text-xs my-1">{nft?.description}</p>
                <div className="flex justify-between items-center mt-3 text-white">
                    <div className='flex justify-start items-center'>
                        <Identicon className ="h-10 w-10 object-contain rounded-full mr-3"
                        string ={'yqwe3shgxnfb'} 
                        size ={50}
                        />
                        <div className='flex flex-col justify-center items-start'>
                            <small className='text-white font-bold'>@owner</small>
                            <small className='text-pink-800 font-semibold'>
                                {nft?.onwer ? truncate(nft?.owner,4,4,11): ''}
                            </small>
                        </div>
                    </div>
                    <div className='flex flex-col text-white'>
                        <small className='text-xs'>Current Price</small>
                        <p className='text-sm font-semibold'>{nft?.cost} ETH</p>
                    </div>
                </div>
            </div>
            {connectedAccount == nft?.owner ? ( 
             <button
             className="flex flex-row justify-center items-center
               w-full text-white text-md bg-[#e32970]
               hover:bg-[#bd255f] py-2 px-5 rounded-full
               drop-shadow-xl border border-transparent
               hover:bg-transparent hover:text-[#e32970]
               hover:border hover:border-[#bd255f]
               focus:outline-none focus:ring mt-5"
                 onClick={onChangePrice}
               >
                 changePrice
             </button>
           ) : (
            <button
                className="flex flex-row justify-center items-center
                  w-full text-white text-md bg-[#e32970]
                  hover:bg-[#bd255f] py-2 px-5 rounded-full
                  drop-shadow-xl border border-transparent
                  hover:bg-transparent hover:text-[#e32970]
                  hover:border hover:border-[#bd255f]
                  focus:outline-none focus:ring mt-5"
                  onClick={handleNFTPurchase}
                  >
                    Change Price
                </button>
                
            )}
        </div>
    </div>
    </div>
  )
}

export default ShowNFT
