import React, { useState } from 'react'
import { MdClose } from 'react-icons/md';

const PassengerAddModal = ({ setShowModal, travellerData, setTravellerData }) => {
    const [passengerData, setPassengerData] = useState({
        ID: travellerData.length + 1,
        Title: "",
        FName: "",
        LName: "",
        Age: "",
        DOB: "",
        Gender: "",
        PTC: "",
        Nationality: "",
        PassportNo: "",
        PLI: "",
        PDOE:"" ,
        VisaType: "",
    })

    // create an empty data easy for load
    // age should be number type

    const handleSubmit = (e) => {
        e.preventDefault();
        setTravellerData([...travellerData, passengerData]);
        console.log(travellerData, '================================= travellerData');
        setShowModal(false);
    }
    return (
        <div className='fixed inset-0 bg-[#feeeee] bg-opacity-20 flex justify-center items-center'>
            <div className='bg-white p-4 rounded-lg relative w-full max-w-md'>
                <MdClose size={24} className='absolute top-2 right-2' onClick={() => setShowModal(false)} />
                <h1 className='text-2xl font-bold'>Add Traveller</h1>
                <form onSubmit={handleSubmit} className='flex flex-col gap-2'>
                    <select className='border border-gray-300 rounded-md p-2' name="" value={passengerData.Title} onChange={(e) => setPassengerData({ ...passengerData, Title: e.target.value })} id="">
                        <option value="">Select Title</option>
                        <option value="Mr">Mr</option>
                        <option value="Mrs">Mrs</option>
                        <option value="Ms">Ms</option>
                        <option value="Dr">Dr</option>
                    </select>
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="First Name" value={passengerData.FName} onChange={(e) => setPassengerData({ ...passengerData, FName: e.target.value })} />
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="Last Name" value={passengerData.LName} onChange={(e) => setPassengerData({ ...passengerData, LName: e.target.value })} />
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="Age" value={passengerData.Age} onChange={(e) => setPassengerData({ ...passengerData, Age: e.target.value })} />
                    <input className='border border-gray-300 rounded-md p-2' type="date" placeholder="Date of Birth" value={passengerData.DOB} onChange={(e) => setPassengerData({ ...passengerData, DOB: e.target.value })} />
                    <select className='border border-gray-300 rounded-md p-2' name="" value={passengerData.Gender} onChange={(e) => setPassengerData({ ...passengerData, Gender: e.target.value })} id="">
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                    </select>
                    <select className='border border-gray-300 rounded-md p-2' name="" value={passengerData.PTC} onChange={(e) => setPassengerData({ ...passengerData, PTC: e.target.value })} id="">
                        <option value="">Select PTC</option>
                        <option value="ADT">Adult</option>
                        <option value="CHD">Child</option>
                        <option value="INF">Infant</option>
                    </select>
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="Nationality" value={passengerData.Nationality} onChange={(e) => setPassengerData({ ...passengerData, Nationality: e.target.value })} />
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="Passport No." value={passengerData.PassportNo} onChange={(e) => setPassengerData({ ...passengerData, PassportNo: e.target.value })} />
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="PLI" value={passengerData.PLI} onChange={(e) => setPassengerData({ ...passengerData, PLI: e.target.value })} />
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="PDOE" value={passengerData.PDOE} onChange={(e) => setPassengerData({ ...passengerData, PDOE: e.target.value })} />
                    <input className='border border-gray-300 rounded-md p-2' type="text" placeholder="Visa Type" value={passengerData.VisaType} onChange={(e) => setPassengerData({ ...passengerData, VisaType: e.target.value })} />
                    <button className='bg-black text-white px-4 py-2 rounded-md mt-4 w-full' type="submit">Add Traveller</button>
                </form>
            </div>
        </div >
    )
}

export default PassengerAddModal