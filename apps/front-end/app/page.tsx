'use client';

import { useRouter } from "next/navigation"
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';


import { 
  ArrowRight, 
  Users, 
  Zap, 
  Palette, 
  Share2, 
  Download, 
  Github,
  Play,
  CheckCircle,
  Sparkles
} from 'lucide-react';

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const Router = useRouter()
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-black rounded-lg flex items-center justify-center">
                <Palette className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-black">Nexus</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-600 hover:text-black transition-colors">Features</a>
              <a href="#examples" className="text-gray-600 hover:text-black transition-colors">Examples</a>
              <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white" onClick={() =>
                Router.push("/signin")
              }>
                Sign In
              </Button>
              <Button className="bg-black text-white hover:bg-purple-600" onClick={() => {
                Router.push("/signin")
              }}>
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-purple-50 py-20 sm:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-200 mb-6">
                <Sparkles className="w-4 h-4 mr-2" />
                Free & Open Source
              </Badge>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
                Virtual whiteboard for{' '}
                <span className="bg-gradient-to-r from-purple-600 to-black bg-clip-text text-transparent">
                  sketching
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Collaborative diagramming made simple. Create beautiful hand-drawn like diagrams, 
                wireframes, and illustrations with your team in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Button 
                  size="lg" 
                  className="bg-black text-white hover:bg-purple-600 transition-colors group"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
                  Start Drawing
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-black text-black hover:bg-black hover:text-white group"
                >
                  <Github className="w-5 h-5 mr-2" />
                  View on GitHub
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
              
              
            </div>
            
            <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-black rounded-2xl transform rotate-3 opacity-10"></div>
                <Card className="relative bg-white shadow-2xl border-0 overflow-hidden">
                  <CardContent className="p-0">
                    <div className="h-96 bg-gradient-to-br from-purple-50 to-gray-50 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-black rounded-full flex items-center justify-center mb-4 mx-auto">
                          <Palette className="w-12 h-12 text-white" />
                        </div>
                        <p className="text-gray-500">Interactive canvas preview</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Everything you need to bring ideas to life
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed for seamless collaboration and creativity
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Users,
                title: 'Real-time Collaboration',
                description: 'Work together with your team in real-time. See cursors, selections, and changes as they happen.'
              },
              {
                icon: Zap,
                title: 'Lightning Fast',
                description: 'Optimized for performance with smooth drawing experience, even with complex diagrams.'
              },
              {
                icon: Palette,
                title: 'Beautiful Hand-drawn Style',
                description: 'Create diagrams that look hand-drawn with our unique rendering engine.'
              },
              {
                icon: Share2,
                title: 'Easy Sharing',
                description: 'Share your work with a simple link. No accounts or sign-ups required for viewers.'
              },
              {
                icon: Download,
                title: 'Export Anywhere',
                description: 'Export your diagrams as PNG, SVG, or save them as Drawly files.'
              },
              {
                icon: Github,
                title: 'Open Source',
                description: 'Built in the open. Contribute, customize, or self-host your own instance.'
              }
            ].map((feature, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-0 shadow-md"
              >
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-black rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section id="examples" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-black mb-4">
              Perfect for any use case
            </h2>
            <p className="text-xl text-gray-600">
              From simple sketches to complex system diagrams
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'Wireframes',
              'System Architecture',
              'Flowcharts',
              'Mind Maps',
              'User Journeys',
              'Network Diagrams',
              'Process Flows',
              'Brainstorming'
            ].map((example, index) => (
              <Card 
                key={index} 
                className="group hover:shadow-md transition-all duration-300 hover:scale-105 bg-white border-0"
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-gray-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:from-purple-500 group-hover:to-black transition-all">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-black rounded opacity-60 group-hover:opacity-100 group-hover:text-white transition-all"></div>
                  </div>
                  <h3 className="font-semibold text-black group-hover:text-purple-600 transition-colors">{example}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-black to-purple-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to start creating?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Join thousands of teams already using Nexus Draw to bring their ideas to life
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 group"
            >
              <Play className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform" />
              Start Drawing Now
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-white text-white hover:bg-white hover:text-black group"
            >
              <Github className="w-5 h-5 mr-2" />
              Star on GitHub
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-white rounded-lg flex items-center justify-center">
                  <Palette className="w-5 h-5 text-black" />
                </div>
                <span className="text-xl font-bold text-white">Nexus</span>
              </div>
              <p className="text-gray-400">
                Virtual whiteboard for sketching hand-drawn like diagrams
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Community</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Twitter</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Nexus. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}