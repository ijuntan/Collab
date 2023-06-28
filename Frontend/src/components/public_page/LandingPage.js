import React, {useRef, useState, useEffect} from 'react'
import LoginForm from './LoginForm'
import SignUpForm from './SignUpForm'

const scroll = (ref) => {
  if(ref.current)
    window.scrollTo({
      top: ref.current.offsetTop == 0? 0 : ref.current.offsetTop + 80, 
      left:0, 
      behavior:'smooth'
    }) 
}

const FadeIn = ({ children, on }) => {
  return <div className="animate-fadeIn" key={on}>{children}</div>
}

const LandingHeader = (props) => {
  const headerContent = [
    {
      name: "Features",
      ref: props.featureRef
    },
    {
      name: "How It Works",
      ref: props.worksRef
    },
    {
      name: "Testimonial",
      ref: props.testimonialRef
    },
  ]

  return (
    <header ref={props.headerRef} className="
        flex justify-between items-center
        p-4
    ">
      <img src = "images/collab.png" alt='logo' 
          className="
          h-14 ml-2 p-2
          "
      />

      <ul className=" max-sm:hidden
          flex justify-center items-center gap-7
          text-white text-lg font-medium pl-16
      ">
          {
              headerContent.map( item => (
                  <li className="
                    hover:text-cream-400
                    transition duration-500
                    "
                    key={item.name}
                  >
                    <button onClick={() => scroll(item.ref)}>
                      {item.name}
                    </button>
                  </li>
              ))
          }
      </ul>
      
      <button className="
        text-white rounded 
        border border-2 border-cream-300
        py-2 px-10 
        flex item-center 
        hover:bg-cream-300
        hover:text-black
        transition duration-500
        "
      onClick={props.openModal}
      >
        Login
      </button>

    </header>
  )
}

const LandingHero = () => {
  const heroTitle = "Collab"
  const heroCaption = `
  Collaborate and Create: Join Forces on Our Collaborative Platform to 
  Bring Your Project to Life!
  `
  return(
    <div className="
      flex flex-col grow justify-center items-center gap-8 pb-20
    ">
      <div className="
        font-extrabold 
        text-8xl text-white
      ">
        {heroTitle}
      </div>

      <div className="
        font-bold px-8
        text-2xl text-cream-200
      ">
        {heroCaption}
      </div>
    </div>
  )
}

const LandingFeature = (props) => {
  const featureTitle = `What do we provide?`
  const featureContent = [
    {
      img: "images/real.svg",
      title: "Real-time collaboration",
      caption: `
      The website allows multiple users to work on the same project simultaneously, 
      enabling real-time collaboration and feedback.
      `
    },
    {
      img: "images/good.svg",
      title: "Empower projects",
      caption: `
      The website provides communication tools such as chatbox to 
      communicate and collaborate effectively throughout the project.
      `
    },
    {
      img: "images/chat.svg",
      title: "Ease of communication",
      caption: `
      The website provides communication tools int the form of a chatbox to 
      communicate and collaborate effectively throughout the project.
      `
    },
    
  ]
  return(
    <div ref={props.featureRef} className="
        flex flex-col h-auto gap-20
        rounded-t-xlg -mt-16 z-10 py-20 px-16
        bg-gradient-radial from-amber-200 to-amber-700 to-50%
    ">

        <div className="
          text-9xl text-cream-200 text-center font-bebas
          mt-20 [text-shadow:40px_40px_rgb(69_26_3)] animate-pulse 
        ">
          {featureTitle}
        </div>

        <div className="
          flex justify-around flex-wrap py-36
        ">

          {featureContent.map(item => (
            <div className="
              flex flex-col items-center gap-4 pb-20
            " key={item.title}>
              <img src={item.img} alt={item.title}
                className="rounded-xl w-full max-h-72"
              />
              
              <div className="
                text-4xl font-bold text-white pt-10
              ">
                {item.title}
              </div>

              <div className="
                text-l text-center
                max-w-md
              ">
                {item.caption}
              </div>
            </div>
          ))}
        </div>

    </div>
  )
}

const LandingWork = (props) => {
  const workContent = [
    {
      title: "Create your own project",
      img: "images/create.png",
      caption: "Start by creating a new project on the website, giving it a name, description"
    },
    {
      title: "Collaborate in real-time",
      img: "images/cloud.png",
      caption: `
        Use the website's real-time collaboration tools to work together with your team members on the project. 
        You can edit documents, leave comments, and communicate through chat all in one place`
    },
    {
      title: "Manage tasks and deadlines",
      img: "images/task.png",
      caption: `
        Use the website's task management tools to assign tasks to team members, set deadlines, and track progress.
      `
    }
  ]
  return (
    <div ref={props.worksRef} className="
      flex flex-col py-40 px-20 flex-wrap
      bg-amber-950
    ">
      <div className="
        font-bebas text-9xl text-cream-400 text-center
        md:border-r-8
      ">
        How Does It Work?
      </div>

      <div className="
        flex flex-col pt-40
      ">
        {workContent.map( item => (
          <div className="
            flex flex-col items-center
          " key={item.title}>
            <div className="
              flex justify-center items-center p-5 gap-10
            ">
              <img src={item.img} alt={item.name}
                
              />

              <div className="
                text-4xl font-bold text-white
              ">
                {item.title}
              </div>

            </div>

            <img src="/images/arrow.png" alt={item.name}
                className="invert h-auto w-20 py-10"
            />
          </div>
        ))}
        

        <div className="
          font-bebas text-9xl text-cream-400 text-center
          pt-20
        ">
          Have Fun!
        </div>
      </div>
    </div>
  )
}

const LandingTest = (props) => {  
  const [currentUser, setCurrentUser] = useState(0)
  const userTest = [
    {
      id: 0,
      name: "James Ardie",
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      img: "images/user.svg"
    },
    {
      id: 1,
      name: "Junior Tanaya",
      text: "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
      img: "images/user.svg"
    },
    {
      id: 2,
      name: "Bryan WikWik",
      text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      img: "images/user.svg"
    },
    {
      id: 3,
      name: "Triyono Jaya",
      text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. ",
      img: "images/user.svg"
    },
  ]

  return (
    <div ref={props.testimonialRef} className="
      flex py-20 sm:px-20 max-sm:px-10 bg-white max-xl:flex-col border
    ">
      <div className="
        flex shrink text-bebas items-center justify-center
        xl:text-5xl max-xl:text-4xl text-center font-bold
        max-xl:py-10 xl:px-10 xl:border-r  
      ">
        Our Beloved Users' Words
      </div>

      <div className="flex flex-col flex-1">
        <button className="flex justify-center pt-10">
          <FadeIn on={currentUser}>
            <img src={userTest[currentUser].img} alt='pf1' className="w-40 h-40 border border-gray-900 border-2 rounded-full"/>
          </FadeIn>
        </button>

        <div className="flex justify-center pt-5 font-bold">
          {userTest[currentUser].name}
        </div>

        <div className="flex justify-center py-10">
          <div className="w-1/2 text-center">
            {userTest[currentUser].text}
          </div>
        </div>

        <div className="flex justify-around pb-10 xl:px-10">
          {
            userTest.map( item => (
              <button className="flex justify-center pt-10"
                onClick={() => setCurrentUser(item.id)}
                key={item.id}
              >
                <img src={item.img} alt='pf1' className="w-20 h-20 border border-gray-900 border-2 rounded-full"/>
              </button>
            ))
          }
        </div>
        
      </div>
    </div>
  )
}

const LandingFooter = (props) => {
  const footerContent = [
    {
      name: "Features",
      ref: props.featureRef
    },
    {
      name: "How It Works",
      ref: props.worksRef
    },
    {
      name: "Testimonials",
      ref: props.testimonialRef
    },
  ]

  const footerLogo = [
    {
      name: "images/github.png"
    },
    {
      name: "images/linked.png"
    },
    {
      name: "images/instagram.png"
    },
  ]

  return(
    <div className="
      flex justify-center
      bg-amber-900 gap-20 px-20 ease-in-out
    "
    >
      <div className="flex-1 max-lg:hidden"> 
        <img src="images/collab.png" alt="logo" className="h-80 p-16"/>
      </div>
      

      <div className="
        flex flex-col gap-4 py-20
      ">
        <div className="
          text-2xl text-white
          font-bebas border-b-4
        ">
          About Us
        </div>
        {footerContent.map( item => (
          <button onClick={() => scroll(item.ref)} className="
            text-xl text-white text-left
            font-bebas 
          " key={item.name}>
            {item.name}
          </button>
        ))}
      </div>
      
      <div className="
        flex flex-col gap-4 pt-20 
      ">
        <div className="
          text-2xl text-white
          font-bebas border-b-4
        ">
          Contact Us
        </div>

        <div className="
          flex gap-2 justify-between
        ">
          {footerLogo.map( item => (
          <img key={item.name} src={item.name} alt="logo" className="h-10 invert brightness-0"/>
        ))}
          
        </div>
      </div>
    </div>
  )
}

function LandingPage() {
  const headerRef = useRef(null)
  const featureRef = useRef(null)
  const worksRef = useRef(null)
  const testimonialRef = useRef(null)
  const [showFab, setShowFab] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [showLogin, setShowLogin] = useState(true)

  const listenScrollEvent = () => {
    return (window.scrollY < 100 ? setShowFab(false) : setShowFab(true))
  }

  const openModal = () => setShowForm(true)
  const closeModal = () => setShowForm(false)
  
  useEffect(() => {
    window.addEventListener('scroll', listenScrollEvent);
  });

  return (
    <div className={`flex flex-col max-w-full overflow-hidden`}>
      
      <div className={`
      flex flex-col
      drop-shadow-2xl
      bg-hero bg-no-repeat bg-cover bg-fixed bg-center 
      h-hero ${showForm && 'blur-none'}
      `
      }
      >
        <LandingHeader 
          featureRef={featureRef} 
          worksRef={worksRef} 
          testimonialRef={testimonialRef} 
          headerRef={headerRef}
          openModal={openModal}
        />

        <LandingHero/>
        
      </div>

      <LandingFeature featureRef={featureRef} />

      <LandingWork worksRef={worksRef} />

      <LandingTest testimonialRef={testimonialRef} />

      <LandingFooter 
        featureRef={featureRef} 
        worksRef={worksRef} 
        testimonialRef={testimonialRef}
      />

      { showFab &&
        <button className="fixed bg-black bottom-10 right-10 z-50 text-white rounded-full p-3" 
          onClick={()=>scroll(headerRef)}
        >
          <FadeIn on={showFab}>
            <img src="images/up.svg" alt="up" className="w-10 invert"/>
          </FadeIn>
        </button>
      }

      { showLogin 
        ?
        <LoginForm showForm={showForm} closeModal={closeModal} setShowLogin={setShowLogin}/>
        :
        <SignUpForm showForm={showForm} closeModal={closeModal} setShowLogin={setShowLogin}/>
      }
      
    </div>
  );
}

export default LandingPage;
