import { IoSend } from "react-icons/io5";
import { useState, ChangeEvent, FormEvent, useEffect } from "react";
import { useContextAuth } from '@/database/contexts/AuthContext';
import { fetchRecipientInfo, fetchUserSendInfo } from '@/database/services/usersServices'; 
import { sendMessage } from '@/database/services/chatsServices';
import { UserTypeData } from "@/database/types/types";

export default function SendMessage({ id }: { id: string }) {
    const { user } = useContextAuth();
    const [value, setValue] = useState("");
    const [recipientInfo, setRecipientInfo] = useState<UserTypeData | null>(null);
    const [userSendInfo, setUserSendInfo] = useState<UserTypeData | null>(null);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        const fetchData = async () => {
            const recipient = await fetchRecipientInfo(id);
            const sender = await fetchUserSendInfo(user?.idUser as string);
            setRecipientInfo(recipient);
            setUserSendInfo(sender);
        };
        fetchData();
    }, [id, user?.idUser]);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (value.trim() && user && recipientInfo) {
            await sendMessage(id, userSendInfo, recipientInfo, value);
            setValue(""); 
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-purple-900 fixed left-0 bottom-0 w-full py-10 flex items-center justify-center px-3 flex-col">
            <div className="w-full flex items-center justify-center px-3">
                <input
                    value={value}
                    onChange={handleChange}
                    placeholder="Votre message..."
                    type="text"
                    className="p-3 w-full outline-none border-none rounded-l-md"
                />
                <button type="submit" className="bg-green-500 hover:bg-green-600 text-white p-3 flex items-center gap-2 border-none rounded-r-md">
                    <IoSend />
                    <span>Envoyer</span>
                </button>
            </div>
        </form>
    );
}
