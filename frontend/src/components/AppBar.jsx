import './AppBar.css'

function AppBar({ title = "My App", children }) {
    return (
        <header className="app-bar">
            <div className="app-bar-content">
                <h1 className="app-bar-title">{title}</h1>
                {children && <div className="app-bar-actions">{children}</div>}
            </div>
        </header>
    )
}

export default AppBar