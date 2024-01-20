"use client"
import Image from 'next/image'
import styles from './page.module.css'
import { CodeiumEditor } from "@codeium/react-code-editor";

export default function Home() {
  return (
    <main className={styles.main}>
      <div>
        <CodeiumEditor language="python" />
      </div>
    </main>
  )
}
