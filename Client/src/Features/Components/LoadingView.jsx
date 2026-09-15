import React, { memo } from "react";

const LoadingView = memo(() => {
    return (
        <div className="loading-container active">
            <div className="cooking-animation">
                <div className="cooking-tools">
                    <div className="tool">🥄</div>
                    <div className="tool">🔪</div>
                    <div className="tool">🍴</div>
                </div>
                <div className="glow-circle"></div>
                <div className="pot"></div>
                <div className="steam">
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                    <div className="bubble"></div>
                </div>
            </div>
            <p className="loading-text">Crafting your perfect meal...</p>
        </div>
    );
});

LoadingView.displayName = "LoadingView";
export default LoadingView;