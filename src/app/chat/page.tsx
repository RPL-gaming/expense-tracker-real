import { ChatWindow } from "@/components/ChatWindow";

const ChatbotPage = () => {
  const InfoCard = (
    <div className="p-4 md:p-8 rounded bg-[#25252d] w-full max-h-[85%] overflow-hidden">
      <h1 className="text-3xl md:text-4xl mb-4">👩‍💼 Wiser with Wiza</h1>
      <p className="mb-4">
        Welcome to "Wiser with Wiza", your personal AI-powered financial advisor chatbot. This platform is designed to assist you with general financial advice tailored to your unique situation.
      </p>
      <ul>
        <li className="mb-2">
          💬 <strong>Engage in Conversations:</strong> Feel free to discuss anything related to your financial circumstances. Ask questions or seek advice on managing your finances.
        </li>
        <li className="mb-2">
          📈 <strong>Smart Financial Guidance:</strong> Utilize AI-driven insights to make informed financial decisions, whether it's about investments, savings, or budgeting.
        </li>
        <li className="mb-2">
          👋 <strong>Interactive Experience:</strong> The chatbot is designed to understand and respond to your queries, providing a dynamic interaction experience.
        </li>
        <li>
          🔄 <strong>Continuous Conversations:</strong> If you wish to continue the conversation, simply keep chatting, or you can return to the main page to exit.
        </li>
      </ul>
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
