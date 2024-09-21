"use client"

import React, { useEffect, useRef, useState } from 'react'
import { Button } from "@/app/_components/button"
import { Input } from "@/app/_components/input"
import { Clock, BarChart2, Users, Play } from "lucide-react"
import styles from '@/app/_styles/landing-page.module.scss'

export default function LandingPage() {
  const parallaxRef = useRef<HTMLDivElement>(null)
  const [time, setTime] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrolled = window.scrollY
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${scrolled * 0.5}px)`
      }
    }

    window.addEventListener('scroll', handleScroll)

    const timer = setInterval(() => {
      setTime(prevTime => (prevTime + 10) % 1000000) // Reset at 1,000,000 ms
    }, 10) // Update every 10ms for a faster animation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(timer)
    }
  }, [])

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId)
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const formatTime = (time: number) => {
    const hours = Math.floor(time / 360000).toString().padStart(2, '0')
    const minutes = Math.floor((time % 360000) / 6000).toString().padStart(2, '0')
    const seconds = Math.floor((time % 6000) / 100).toString().padStart(2, '0')
    const milliseconds = (time % 100).toString().padStart(2, '0')
    return `${hours}:${minutes}:${seconds}.${milliseconds}`
  }

  return (
    <div className={styles.landingPage}>
      <header className={styles.header}>
        <div className={styles.headerContainer}>
          <div className={styles.headerLeft}>
            <a className={styles.logo} href="/">
              <Clock className={styles.logoIcon} />
              <span className={styles.logoText}>TimeTrack</span>
            </a>
            <nav className={styles.nav}>
              <button onClick={() => scrollToSection('features')} className={styles.navLink}>
                機能
              </button>
              <button onClick={() => scrollToSection('how-it-works')} className={styles.navLink}>
                使い方
              </button>
              <button onClick={() => scrollToSection('cta')} className={styles.navLink}>
                始める
              </button>
            </nav>
          </div>
          <div className={styles.headerRight}>
            <Button variant="ghost" className={styles.loginButton}>ログイン</Button>
            <Button className={styles.signupButton}>
              アカウント登録
              <Play className={styles.signupIcon} />
            </Button>
          </div>
        </div>
      </header>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div ref={parallaxRef} className={styles.parallax}>
            <div className={styles.parallaxOverlay} />
            <div className={styles.parallaxContent}>
              <div className={styles.timeDisplay}>
                {formatTime(time)}
              </div>
            </div>
          </div>
          <div className={styles.heroContent}>
            <div className={styles.heroText}>
              <h1 className={styles.heroTitle}>
                時間を管理し、生産性を最大化
              </h1>
              <p className={styles.heroDescription}>
                TimeTrackで簡単に時間を記録し、プロジェクトの進捗を可視化。チームの生産性を向上させましょう。
              </p>
            </div>
            <div className={styles.heroForm}>
              <form className={styles.signupForm}>
                <Input className={styles.emailInput} placeholder="メールアドレス" type="email" />
                <Button type="submit" className={styles.submitButton}>
                  アカウント登録
                  <Play className={styles.submitIcon} />
                </Button>
              </form>
            </div>
          </div>
        </section>
        <section id="features" className={styles.features}>
          <div className={styles.featuresContainer}>
            <h2 className={styles.featuresTitle}>主な機能</h2>
            <div className={styles.featuresList}>
              <div className={styles.featureItem}>
                <Clock className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>簡単な時間記録</h3>
                <p className={styles.featureDescription}>
                  ワンクリックで時間の記録を開始。プロジェクトや作業ごとに簡単に時間を追跡できます。
                </p>
              </div>
              <div className={styles.featureItem}>
                <BarChart2 className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>詳細なレポート</h3>
                <p className={styles.featureDescription}>
                  プロジェクトごとの時間使用状況を可視化。効率的な時間管理をサポートします。
                </p>
              </div>
              <div className={styles.featureItem}>
                <Users className={styles.featureIcon} />
                <h3 className={styles.featureTitle}>チーム連携</h3>
                <p className={styles.featureDescription}>
                  チームメンバーの作業時間を簡単に把握。プロジェクトの進捗状況を共有できます。
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="how-it-works" className={styles.howItWorks}>
          <div className={styles.howItWorksContainer}>
            <h2 className={styles.howItWorksTitle}>使い方</h2>
            <div className={styles.howItWorksList}>
              <div className={styles.howItWorksItem}>
              <div className={styles.mockupPcWrapper}>
                <div className={styles.mockupBackground} data-dimensions="1920x1080"></div>
                <img
                  src="/TimeTrackInterface.png"
                  alt="TimeTrackインターフェース"
                  className={styles.interfacePcImage}
                />
              </div>
                <p className={styles.howItWorksDescription}>
                  TimeTrackは直感的なインターフェースで、タスクの管理と時間の記録を簡単に行えます。
                  未着手、進行中、完了の3つのカラムでタスクを整理し、各タスクの所要時間を正確に把握できます。
                </p>
              </div>
              <div className={styles.howItWorksItem}>
              <div className={`${styles.mockupSpWrapper} ${styles.smartphone}`}>
                <div className={styles.mockupBackground} data-dimensions="1170x2532"></div>
                <img
                  src="/TaskView.png"
                  alt="タスク詳細ビュー"
                  className={styles.interfaceSpImage}
                />
              </div>
                <p className={styles.howItWorksDescription}>
                  各タスクの詳細ビューでは、ラベル、説明、チェックリスト、進捗状況を一目で確認できます。
                  さらに、コメント機能を使ってチームメンバーとコミュニケーションを取ることができます。
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="cta" className={styles.cta}>
          <div className={styles.ctaContainer}>
            <h2 className={styles.ctaTitle}>今すぐ始めましょう</h2>
            <p className={styles.ctaDescription}>
              TimeTrackを使って、あなたのチームの生産性を向上させませんか？無料で始められます。
            </p>
            <Button className={styles.ctaButton}>
              アカウント登録
              <Play className={styles.ctaIcon} />
            </Button>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <p className={styles.copyright}>© 2023 TimeTrack Inc. All rights reserved.</p>
        <nav className={styles.footerNav}>
          <a className={styles.footerLink} href="#">
            利用規約
          </a>
          <a className={styles.footerLink} href="#">
            プライバシーポリシー
          </a>
        </nav>
      </footer>
    </div>
  )
}