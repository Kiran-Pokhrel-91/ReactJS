import React from 'react'

const MainContent = () => {

    const text = `
            React.js, commonly referred to as React, is a free and open-source front-end JavaScript library developed and maintained by Meta (formerly Facebook) and a community of individual developers and companies.It is designed to build user interfaces, particularly for single-page applications, mobile apps, and server-rendered applications using frameworks like Next.js and React Router.React is used by an estimated 6% of all websites and is one of the most commonly used web technologies, according to the 2025 Stack Overflow Developer Survey

            At its core, React is a component-based library, meaning that user interfaces are constructed from modular, reusable components that manage their own state.These components can be nested and combined to build complex UIs, promoting code reusability, maintainability, and scalability.React applications typically use JSX, a syntax extension that allows developers to write HTML-like code within JavaScript, making the structure of the UI more intuitive and readable.

            React operates using a virtual DOM (Document Object Model), a lightweight copy of the actual DOM that React maintains in memory.
            When a component's state changes, React first updates the virtual DOM and then efficiently compares it with the previous version to identify only the differences—this process is known as reconciliation.React then updates only the specific parts of the real DOM that have changed, minimizing unnecessary re-renders and significantly improving performance.

            React follows a declarative programming paradigm, where developers describe the UI based on the current state of the application, and React automatically updates and renders the necessary components when that state changes.This contrasts with imperative programming, where developers must manually manipulate the DOM.React also enforces a unidirectional data flow, where data flows from parent components to child components through props, which enhances predictability and simplifies debugging.

            Since React v16.8, the introduction of React Hooks has allowed developers to use state and lifecycle features within functional components without writing classes.Commonly used hooks include useState for managing local state, useEffect for handling side effects like API calls, and useContext for global state management.Hooks must be called at the top level of a function and only from React functions, following specific rules to ensure consistent behavior.

            React does not include built-in routing or state management solutions, so developers often use third-party libraries such as React Router for navigation and Redux for state management.React Native extends React’s capabilities to enable the development of native mobile applications for iOS and Android using the same component-based architecture.

            React is also used for server-side rendering (SSR) and has seen improvements in this area, including the introduction of React Server Components (RSC), which run on the server and can perform asynchronous operations without sending JavaScript to the client.The latest stable version of React is 19.1.0, with ongoing enhancements in areas such as server-side rendering performance, Suspense for handling asynchronous data loading, Concurrent Mode for improved responsiveness, and better integration with modern web standards.

            React’s popularity stems from its flexibility, performance, and rich ecosystem of tools and libraries, making it a preferred choice for building dynamic, interactive, and scalable web and mobile applications.
    `

  return (
    <main>
        <h2>Main Content</h2>
        
        <p style={{ whiteSpace: "pre-line"}}>
            {text}
        </p>
    </main>
  )
}

export default MainContent