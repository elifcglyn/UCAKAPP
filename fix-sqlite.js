#!/usr/bin/env node

/**
 * Geçici çözüm: expo-sqlite'in Node.js 20 ESM uyumluluk sorununu düzeltir
 * Bu script, postinstall hook'u olarak çalışır
 */

const fs = require('fs');
const path = require('path');

const indexPath = path.join(__dirname, 'node_modules', 'expo-sqlite', 'build', 'index.js');

// index.js'i düzelt
if (fs.existsSync(indexPath)) {
  let content = fs.readFileSync(indexPath, 'utf8');
  const originalContent = content;
  
  // Extension'ları ekle
  content = content.replace(/from '\.\/SQLite'/g, "from './SQLite.js'");
  content = content.replace(/from "\.\/SQLite"/g, 'from "./SQLite.js"');
  content = content.replace(/from '\.\/SQLite\.types'/g, "from './SQLite.types.js'");
  content = content.replace(/from "\.\/SQLite\.types"/g, 'from "./SQLite.types.js"');
  
  if (content !== originalContent) {
    fs.writeFileSync(indexPath, content);
    console.log('✅ expo-sqlite index.js fixed');
  }
}

// SQLite.js'i düzelt
const sqlitePath = path.join(__dirname, 'node_modules', 'expo-sqlite', 'build', 'SQLite.js');
if (fs.existsSync(sqlitePath)) {
  let content = fs.readFileSync(sqlitePath, 'utf8');
  const originalContent = content;
  
  // polyfillNextTick import'unu düzelt
  content = content.replace(/import '\.\/polyfillNextTick';/g, "import './polyfillNextTick.js';");
  content = content.replace(/import "\.\/polyfillNextTick";/g, 'import "./polyfillNextTick.js";');
  content = content.replace(/from '\.\/polyfillNextTick'/g, "from './polyfillNextTick.js'");
  content = content.replace(/from "\.\/polyfillNextTick"/g, 'from "./polyfillNextTick.js"');
  
  // @expo/websql/custom directory import'unu düzelt
  content = content.replace(/from '@expo\/websql\/custom'/g, "from '@expo/websql/custom/index.js'");
  content = content.replace(/from "@expo\/websql\/custom"/g, 'from "@expo/websql/custom/index.js"');
  
  if (content !== originalContent) {
    fs.writeFileSync(sqlitePath, content);
    console.log('✅ expo-sqlite SQLite.js fixed');
  }
}

if (!fs.existsSync(indexPath) && !fs.existsSync(sqlitePath)) {
  console.log('⚠️  expo-sqlite build folder not found, skipping fix');
} else {
  console.log('✅ expo-sqlite import paths fixed for Node.js 20');
}

