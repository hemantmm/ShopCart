export function Contact()
{
    return(
        <div style={{width: '100%',
        minHeight: '88.5vh',
        backgroundColor: '#4158d0',
        backgroundImage: 'linear-gradient(43deg, #4158d0 0%, #c850c0 46%, #ffcc70 100%)',
        paddingTop: '10px'}}>

        <div style={{fontSize:"16px", lineHeight:"1.5", color:"#666", margin:"0 auto", width:"50rem", padding:"20px", textAlign:"center", marginTop:"150px"}}>
            <h2 style={{ fontSize: '3.2rem', fontWeight: 800, letterSpacing: '1px' }}>Get In Touch</h2>
        <p style={{ textAlign: 'center', color:"white" }}>
          I’m currently searching for opportunities for a front-end developer role.
          <br /> If there is any vacancy my inbox is always open. Whether
          <br /> you have any further questions or just want to say hi, <br />
          I’ll try my best to get back to you!
        </p>
        <button
          style={{
              display: 'block',
            margin: '0 auto',
            width: '150px',
            height: '50px',
            border: 'solid 2px',
            backgroundColor: 'transparent',
            letterSpacing: '2px',
            color:"white"
        }}
        onClick={() => {
            window.open('https://www.linkedin.com/in/hemant-mehta-97b40b220/');
        }}
        >
          Say Hello
        </button>
        <p style={{ position: 'absolute', bottom: '0', left: '0', right: '0', fontSize: '12px', fontFamily: 'Poppins',color:"white" }}>
          © Copyright 2023
          <br />
          Designed & Built by <span style={{ fontWeight: '700', letterSpacing: '1px' }}>HemantM</span>
        </p>
        </div>
            </div>
    )
}