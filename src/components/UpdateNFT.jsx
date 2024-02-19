import { use } from 'chai'
import React from 'react'
import { useState } from 'react'
import {FaTimes} from 'react-icons/fa'
import { setGlobalState,setLoadingMsg,useGlobalState } from '../store'
import { updateNFT } from '../Blockchain.services'
const imgHero = "https://images.cointelegraph.com/images/1434_aHR0cHM6Ly9zMy5jb2ludGVsZWdyYXBoLmNvbS91cGxvYWRzLzIwMjEtMDYvNGE4NmNmOWQtODM2Mi00YmVhLThiMzctZDEyODAxNjUxZTE1LmpwZWc=.jpg" 

const CreateNFT = () => {
    const [modal] = useGlobalState('updateModal')
    const nft = useGlobalState('nft')
    const [price, setPrice] = useState(nft?.cost)
    const handleSubmit = async () =>{
        e.preventDefault()

        if(!price) return

        setGlobalState('modal','scale-0')
        setLoadingMsg('Initializing price update ...')

        try {
            setLoadingMsg('Price updating ...')
            setGlobalState('updateModal', 'scale-0')
            await updateNFT({id: nft.id, cost: price })
            setAlert('Price updated...', 'green')
            window.location.reload()
        } catch (error){
            console.log('Error updating file: ', error)
            setAlert('Update failed...', 'red')
        }
        closeModal()
    }
    
    const closeModal = () =>{
        setGlobalState('updateModal', 'scale-0')
        resetForm()
    }
    const resetForm =() =>{
        
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
                <p className="font-semibold ">Candy NFT</p>
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
                    src={imgHero} 
                    alt="NFT"
                    />
                </div>
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

            <button
            type="submit"
            onClick={handleSubmit}
            className="flex flex-row justify-center items-center
              w-full text-white text-md bg-[#e32970]
              hover:bg-[#bd255f] py-2 px-5 rounded-full
              drop-shadow-xl border border-transparent
              hover:bg-transparent hover:text-[#e32970]
              hover:border hover:border-[#bd255f]
              focus:outline-none focus:ring mt-5">
                Update now
            </button>
        </form>
    </div>
    </div>
  )
}

export default CreateNFT
