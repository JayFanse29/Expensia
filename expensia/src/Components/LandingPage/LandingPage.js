import React, { useState } from 'react'
import './LandingPage.css'
import LoginWindow from '../LoginWindow/LoginWindow';

function LandingPage(props) {
  const year = new Date().getFullYear();

  const [loginVisible,setLoginVisible] = useState(false);

  const openLogin = () => {
    setLoginVisible(true);
  }

  return (
    <>
    {
      loginVisible ? <LoginWindow setLoginVisible={setLoginVisible} setLogin={props.setLogin} setUserId={props.setUserId}/> : null
    }
      <nav className='navBar'>
        <div className='navBarLeftChild'>
          <a id="logo" href="#mainBanner"><img alt=''/></a>
          <li><a href="#getStarted">About</a></li>
          <li><a href="https://mail.google.com/mail/?view=cm&to=expensia.official@gmail.com" target='blank'>Contact Us</a></li>
        </div>
        <div className='navBarRightChild'>
          <li><button onClick={openLogin}>Login</button></li>
        </div>
      </nav>
      <div className='mainBanner' id='mainBanner'>
        <div className='mainBannerLayer'>
        <div className='appName'>EXPENSIA</div>
        <div className='appSubName'>Group Payments Made Easier!</div>
        </div>
      </div>
      <div className='getStarted' id='getStarted'>
        <button onClick={openLogin}>Get Started</button>
      </div>
      <div className='featureTitle' id="featureTitle">
        Features & Services
      </div>
      <div className='featureMain'>
        <div className='featureMainLayer'>
        <div className='featureCardGrid'>
        <div className='featureCard1'>
          <div className='featureCardIcon' id='fci1'></div>
          <div className='featureCardTitle'>Expense Tracking</div>
          <div className='featureCardContent'>Expensia simplifies financial tracking by allowing users to categorize expenses across different activities and groups. This feature provides clear visibility into spending patterns, aiding users in budgeting and financial planning.</div>
        </div>
        <div className='featureCard2'>
          <div className='featureCardIcon' id='fci2'></div>
          <div className='featureCardTitle'>Splitting and Sharing</div>
          <div className='featureCardContent'> Users can effortlessly divide bills and expenses among friends or teammates. Expensia automates the process, ensuring fairness and reducing disputes over who owes what, enhancing group financial transparency and efficiency.</div>
        </div>
        <div className='featureCard1'>
          <div className='featureCardIcon' id='fci3'></div>
          <div className='featureCardTitle'>Group Budgeting</div>
          <div className='featureCardContent'>Expensia facilitates collaborative budget management by enabling groups to set and monitor financial targets together. It supports shared financial planning for households, clubs, or projects, promoting accountability towards common financial goals.</div>
        </div>
        <div className='featureCard2'>
          <div className='featureCardIcon' id='fci4'></div>
          <div className='featureCardTitle'>Payment Management</div>
          <div className='featureCardContent'>It streamlines payment processes within groups by providing tools for tracking debts and facilitating easy settlements. This feature reduces the administrative burden of managing group finances, ensuring timely payments and financial clarity.</div>
        </div>
        </div>
        <div className='usecaseTitle'>
          EXPENSIA Lets You...
        </div>
        <div className='usecaseGrid'>
        <div id='usecase1' className='usecase'>
          <div className='usecaseHover'>
            <div>Seamlessly manage group trip expenses and pool travel funds with ease.</div>
          </div>
        </div>
        <div id='usecase2' className='usecase'>
          <div className='usecaseHover'>
            <div>Effortlessly split rent, utilities, groceries, and household items with your roommates.</div>
          </div>
        </div>
        <div id='usecase3' className='usecase'>
          <div className='usecaseHover'>
            <div>Easily split restaurant bills and share event costs with friends and family.</div>
          </div>
        </div>
        <div id='usecase4' className='usecase'>
          <div className='usecaseHover'>
            <div>Smoothly organize and divide expenses for club activities and sports.</div>
          </div>
        </div>
        </div>
        </div>
      </div>
      <footer className='footerSmall'>
        Made with ❤️ by Jay Fanse. All rights reserved. Copyright &copy; {year} 
      </footer>
    </>
  )
}

export default LandingPage