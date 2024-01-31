"use client"
import styles from './page.module.css'
import { CodeiumEditor } from "@codeium/react-code-editor";

export default function Home() {
  return (
    <main className={styles.main}>
      <CodeiumEditor language="python" />
    </main>
  )
}
