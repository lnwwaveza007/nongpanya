import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';

interface ModalBoxProps {
    isOpen: boolean;
    state?: string;
}

const ModalBox = (props: ModalBoxProps) => {
    const [emojiIndex, setEmojiIndex] = useState(0);
    const emojis = ["( ^.^ )", "( >.< )", "( *.* )", "( ^o^ )", "( °.° )"];

    useEffect(() => {
        if (props.isOpen) {
            const interval = setInterval(() => {
                setEmojiIndex((prev) => (prev + 1) % emojis.length);
            }, 500); // Change expression every 500ms

            return () => clearInterval(interval);
        }
    }, [props.isOpen]);

    return (
        <Dialog open={props.isOpen}>
            {props.state !== 'success' && (
            <DialogContent className="w-[80%] flex flex-col items-center justify-center py-12 rounded-md border-2 border-[#FF4B28] [&>button]:hidden">
                <div className="text-6xl mb-4 text-[#FF4B28] transition-all duration-300 ease-in-out">
                    {emojis[emojiIndex]}
                </div>
                {/* Animated Pills */}
                <div className="flex justify-center items-center space-x-2 pt-4">
                    {[...Array(3)].map((_, i) => (
                        <div
                            key={i}
                            className="w-6 h-12 bg-primary rounded-full animate-pulse"
                            style={{ animationDelay: `${i * 0.3}s` }}
                        ></div>
                    ))}
                </div>
                <p className="text-2xl font-medium text-[#FF4B28]">Sending form</p>
                <p className="text-md text-gray-500">Loading . . .</p>
            </DialogContent>)}
        </Dialog>
    );
};

export default ModalBox;