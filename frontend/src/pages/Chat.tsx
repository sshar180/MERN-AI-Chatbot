import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./Chat.module.css";
import ChatItem from "../components/chat/ChatItem";
import {
	deleteAllChats,
	getAllChats,
	postChatRequest,
} from "../../helpers/api-functions";

import sendIcon from "/logos/send-icon.png";
import noMsgBot from "/logos/3.png";
import upArrow from "/logos/up-arrow.png";
import ChatLoading from "../components/chat/ChatLoading";

import { useAuth } from "../context/context";
import SpinnerOverlay from "../components/shared/SpinnerOverlay";
import toast from "react-hot-toast";
import logos from "/logos/logo.png";

type Message = {
	role: "user" | "assistant";
	content: string;
};

const Chat = () => {
	const auth = useAuth();

	const [chatMessages, setChatMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isLoadingChats, setIsLoadingChats] = useState<boolean>(true);
	const [deleteChatToggle, setDeleteChatToggle] = useState<boolean>(false);

	const inputRef = useRef<HTMLInputElement | null>(null);
	const messageContainerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messageContainerRef.current) {
			messageContainerRef.current.scrollTop =
				messageContainerRef.current.scrollHeight;
		}
	}, [chatMessages]);

	useLayoutEffect(() => {
		const getChats = async () => {
			try {
				if (auth?.isLoggedIn && auth.user) {
					const data = await getAllChats();
					setChatMessages([...data.chats]);
				}
				setIsLoadingChats(false);
			} catch (err) {
				console.log(err);
				setIsLoadingChats(false);
			}
		};
		getChats();
	}, [auth]);

	const sendMsgHandler = async () => {
		const content = inputRef.current?.value as string;

		if (inputRef.current) inputRef.current.value = "";

		const newMessage: Message = { role: "user", content };
		setChatMessages((prev) => [...prev, newMessage]);

		// send request to backend
		setIsLoading(true);
		const chatData = await postChatRequest(content);
		setChatMessages([...chatData.chats]);
		setIsLoading(false);
	};

	const deleteChatsToggle = () => {
		setDeleteChatToggle((prevState) => !prevState);
	};

	const clearChatsHandler = async () => {
		try {
			toast.loading("Deleting Messages ...", { id: "delete-msgs" });
			const data = await deleteAllChats();
			setChatMessages(data.chats);
			setDeleteChatToggle(false);
			toast.success("Deleted Messages Successfully", { id: "delete-msgs" });
		} catch (error: any) {
			toast.error(error.message, { id: "delete-msgs" });
		}
	};

	const variants = {
		animate: {
			y: [0, -10, 0, -10, 0],
			transition: {
				type: "spring",
				y: { repeat: Infinity, duration: 4, stiffness: 100, damping: 5 },
			},
		},
	};

	const logo = {
		animate: {
			y: [0, -5, 0, -5, 0],
			transition: {
				type: "spring",
				y: {
					repeat: Infinity,
					duration: 4,
					stiffness: 100,
					damping: 5,
				},
			},
		},
		animateReverse: {
			transform: "rotate(180deg)",
			y: "-4",
			transition: {
				duration: 0.5,
			},
		},
		initialBtn: {
			y: "4",
			opacity: 0,
		},
		animateBtn: {
			y: 0,
			opacity: 1,
			transition: {
				duration: 0.5,
			},
		},
		exitBtn: {
			y: "-20",
			opacity: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	const placeHolder = (
		<div className={styles.no_msgs}>
			<img src={logos} alt='logo' className={styles.logo} />
			<motion.div
				className={styles.no_msg_logo}
				variants={variants}
				animate='animate'>
				<img alt='no msg bot' src={noMsgBot}></img>
			</motion.div>
			<p>
			It's peaceful around here! Drop a message to kickstart the chat and inquire about anything on your mind. You'll receive the answers you're seeking.
			</p>
		</div>
	);

	const chats = chatMessages.map((chat) => (
		<ChatItem //@ts-ignore
			key={`${chat.content}${Math.random()}`} //@ts-ignore
			content={chat.content} //@ts-ignore
			role={chat.role}
		/>
	));

	return (
		<div className={styles.parent}>
			<div className={styles.chat} ref={messageContainerRef}>
				{isLoadingChats && <SpinnerOverlay />}
				{!isLoadingChats && (
					<>
						{chatMessages.length === 0 && placeHolder}
						{chatMessages.length !== 0 && chats}
						{isLoading && <ChatLoading />}
					</>
				)}
			</div>
			<div className={styles.inputContainer}>
				<div className={styles.inputArea}>
					<div className={styles.eraseMsgs}>
						<motion.img
							variants={logo}
							animate={!deleteChatToggle ? "animate" : "animateReverse"}
							src={upArrow}
							alt='top icon'
							onClick={deleteChatsToggle}
						/>
						<AnimatePresence>
							{deleteChatToggle && (
								<motion.button
									className={styles.eraseBtn}
									onClick={clearChatsHandler}
									variants={logo}
									initial='initialBtn'
									animate='animateBtn'
									exit='exitBtn'>
									CLEAR CHATS
								</motion.button>
							)}
						</AnimatePresence>
					</div>
					<input
						type='text'
						maxLength={1500}
						ref={inputRef}
						disabled={isLoadingChats || isLoading ? true : false}
                        placeholder="Enter your query here"
					/>
					<button className={styles.icon} onClick={sendMsgHandler}>
						<img alt='icon' src={sendIcon} />
					</button>
				</div>
			</div>
		</div>
	);
};

export default Chat;
