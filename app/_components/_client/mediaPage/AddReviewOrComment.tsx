import { Dispatch, SetStateAction } from "react";
import { motion } from "framer-motion";

interface props {
  showState: string;
  reviewTitle: string;
  setReviewTitle: Dispatch<SetStateAction<string>>;
  setReviewRating: Dispatch<SetStateAction<number | string>>;
  reviewRating: number | string;
  content: string;
  setContent: Dispatch<SetStateAction<string>>;
  handleAdd: () => void;
}

interface VariableContentType {
  comments: {
    placeHolder: string;
    height: string;
  };
  reviews: {
    placeHolder: string;
    height: string;
  };
}

export default function AddReviewOrComment({
  showState,
  reviewTitle,
  setReviewTitle,
  setReviewRating,
  reviewRating,
  content,
  setContent,
  handleAdd,
}: props) {
  const handleRatChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === "" || /^[0-9]*\.?[0-9]*$/.test(value)) {
      const num = parseFloat(value);
      if (
        value === "" ||
        (!isNaN(num) &&
          num <= 10 &&
          (!value.includes(".") || value.split(".")[1].length <= 2))
      ) {
        setReviewRating(value);
      }
    }
  };

  const VariableContent: VariableContentType = {
    comments: {
      placeHolder: "Share your thoughts on this movie...",
      height: "h-[120px]",
    },
    reviews: {
      placeHolder: "Write a detailed review to help others...",
      height: "h-[150px]",
    },
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex flex-col gap-4">
        {showState === "reviews" && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-3 group/input relative">
              <input
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-300"
                type="text"
                placeholder="Review Title"
                name="review_title"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within/input:ring-1 group-focus-within/input:ring-accent/20 transition-all duration-300" />
            </div>
            <div className="group/input relative">
              <input
                placeholder="Rating / 10"
                value={reviewRating}
                onChange={handleRatChange}
                max={10}
                type="text"
                className="w-full px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-300 font-mono text-center"
              />
              <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within/input:ring-1 group-focus-within/input:ring-accent/20 transition-all duration-300" />
            </div>
          </div>
        )}
        <div className="group/input relative">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              VariableContent[showState as keyof VariableContentType].placeHolder
            }
            className={`w-full ${
              VariableContent[showState as keyof VariableContentType].height
            } px-5 py-4 rounded-2xl bg-white/[0.03] border border-white/10 text-white placeholder:text-gray-500 outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all duration-300 resize-none leading-relaxed`}
          />
          <div className="absolute inset-0 rounded-2xl pointer-events-none group-focus-within/input:ring-1 group-focus-within/input:ring-accent/20 transition-all duration-300" />
        </div>
      </div>

      <motion.button
        onClick={handleAdd}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="relative group overflow-hidden bg-accent hover:bg-[#ff0a16] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-sm shadow-lg shadow-accent/20 transition-all duration-300 flex items-center justify-center gap-2"
      >
        <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 bg-linear-to-r from-transparent via-white/20 to-transparent" />
        <span className="relative z-10">Post {showState === "reviews" ? "Review" : "Comment"}</span>
      </motion.button>
    </div>
  );
}
