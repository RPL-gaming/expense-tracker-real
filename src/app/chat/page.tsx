import { ChatWindow } from "@/components/ChatWindow";

const ChatbotPage = () => {
    const InfoCard = (
        <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
            <h1 className="text-3xl md:text-4xl mb-4">👩‍💼 Wiser with Wiza</h1>
        </div>
    );
    return (
        <ChatWindow
            endpoint="api/chat"
            emoji="👩‍💼‍️"
            titleText="Wiser with Wiza"
            placeholder="I'm Wiza! Your friendly neighborhood financial advisor. Ask me anything about your finances!"
            emptyStateComponent={InfoCard}
        ></ChatWindow>
    );
};

export default ChatbotPage;