import { use } from 'chai'
import React from 'react'
import { useState } from 'react'
import {FaTimes} from 'react-icons/fa'
import { setAlert, setGlobalState,setLoadingMsg,useGlobalState } from '../store'
import { create} from 'ipfs-http-client'
import { mintNFT } from '../Blockchain.services'
const imgHero = "https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg" 
const auth =
  'Basic ' +
  Buffer.from(
    '2Gg95YqQ672apEtGQbewfwGQANc' + ':' + 'b2c85789868e83772bfbc59ddd6d09bb',
  ).toString('base64')

const client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
    authorization: auth,
  },
})

const CreateNFT = () => {
    const [modal] = useGlobalState('modal')
    const [title, setTitle] = useState('')
    const [price, setPrice] = useState('')
    const [description, setDescription] = useState('')
    const [fileUrl, setFileUrl] = useState('')
    const [imgBase64, setImgBase64] = useState(null)
    const handleSubmit = async (e) =>{
        e.preventDefault()

        if (!title || !price || !description) return
        setGlobalState('modal', 'scale-0')
        setLoadingMsg('Uploading to IPFS..')
        
        try {
            const created = await client.add(fileUrl)
            setLoadingMsg('Uploaded,approve transactions now...')
            const metadataURI = `https://ipfs.io/ipfs/${created.path}`
            const nft = { title, price, description, metadataURI }
            await mintNFT(nft)
            resetForm()
            setAlert('Minting completed...')
            window.location.reload()
        } catch (error) {
            console.log('Error uploading file: ',error)
            setAlert('Minting failed...', 'red')
        }
        
    }
    
    const changeImage = async (e) => {
        const reader = new FileReader()
        if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])
    
        reader.onload = (readerEvent) => {
          const file = readerEvent.target.result
          setImgBase64(file)
          setFileUrl(e.target.files[0])
        }
      }

    const closeModal = () =>{
        setGlobalState('modal', 'scale-0')
        resetForm()
    }
    const resetForm =() =>{
        setFileUrl('')
        setImgBase64(null)
        setTitle('')
        setDescription('')
        setPrice('')
    }
  return (
    <div className={`fixed top-0 left-0 w-screen h-screen flex items-center
    justify-center bg-black bg-opacity-50 transform
    transition-transform duration-300 ${modal}`}
    >
        <div 
        className="bg-[#151c25] shadow-xl shadow-[#e32970]
        rounded-xl w-11/12 md:w-2/5 h-7/12 p-6"
        >
        <form onSubmit={handleSubmit} className="flex flex-col">
            <div className="flex flex-row justify-between items-center text-gray-400">
                <p className="font-semibold ">Add NFT</p>
                <button 
                type="button" 
                onClick={closeModal}
                className="border-0 bg-transparent focus:outline-none">
                    <FaTimes/>
                </button>
            </div>
            <div className="flex flex-row justify-center items-center rounded-xl mt-5">
                <div className="shrink-0 rounded-xl overflow-hidden h-20 w-20">
                    <img 
                    className="h-full w-full object-cover cursor-pointer"
                    src={imgBase64 ||imgHero} 
                    alt="NFT"
                    />
                </div>
            </div>

            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <label className='block'>
                    <span className="sr-only">Choose Profile Photo</span>
                    <input
                    type ="file"
                    accept="image/png, image/gif, image/jpeg, image/webp" 
                    className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-full file:border-0
                    file:text-sm file:font-semibold
                    file:bg-[#19212c] file:text-gray-400
                    hover:file:bg-[#1d2631]
                    cursor-pointer focus:ring-0 focus:outline-none"
                    onChange={changeImage}
                    required
                    />
                </label>
            </div>

            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <input
                    type ="text"
                    className="block w-full text-sm
                    text-slate-500 bg-transparent border-0
                    focus:outline-none focus:ring-0"
                    placeholder='Title'
                    name="title"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    required
                /> 
            </div>

            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <input
                    type ="number"
                    className="block w-full text-sm
                    text-slate-500 bg-transparent border-0
                    focus:outline-none focus:ring-0"
                    placeholder='Price (ETH)'
                    min={0.01}
                    step={0.01}
                    name="price"
                    onChange={(e) => setPrice(e.target.value)}
                    value={price}
                    required
                /> 
            </div>

            <div className="flex flex-row justify-between items-center bg-gray-800 rounded-xl mt-5">
                <textarea
                    type ="text"
                    className="block w-full text-sm
                    text-slate-500 bg-transparent border-0
                    focus:outline-none focus:ring-0"
                    placeholder='Description'
                    name='description'
                    onChange={(e) => setDescription(e.target.value)}
                    value={description}
                    required
                ></textarea> 
            </div>

            <button
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#e32970]
              hover:bg-[#bd255f] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#e32970]
              hover:border hover:border-[#bd255f]
              focus:outline-none focus:ring mt-5">
                Mint Now
            </button>
        </form>
    </div>
    </div>
  )
}

export default CreateNFT
