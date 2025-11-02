#!/bin/bash

# Postman Collection Validation Script
# This script validates the Postman collection and environment files

echo "🔍 Validating Postman Collection Files..."
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

ERRORS=0

# Check if jq is installed
if ! command -v jq &> /dev/null; then
    echo -e "${RED}❌ Error: jq is not installed${NC}"
    echo "Please install jq to validate JSON files: sudo apt-get install jq"
    exit 1
fi

echo "✅ jq is installed"
echo ""

# Validate Collection File
COLLECTION_FILE="postman/Employee-Management-CRM.postman_collection.json"
echo "📦 Validating Collection File: $COLLECTION_FILE"

if [ ! -f "$COLLECTION_FILE" ]; then
    echo -e "${RED}❌ Collection file not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    # Check if valid JSON
    if jq empty "$COLLECTION_FILE" 2>/dev/null; then
        echo -e "${GREEN}✅ Valid JSON format${NC}"
        
        # Extract and display collection info
        COLLECTION_NAME=$(jq -r '.info.name' "$COLLECTION_FILE")
        FOLDER_COUNT=$(jq '.item | length' "$COLLECTION_FILE")
        TOTAL_REQUESTS=$(jq '[.item[].item | length] | add' "$COLLECTION_FILE")
        
        echo -e "${GREEN}✅ Collection Name: $COLLECTION_NAME${NC}"
        echo -e "${GREEN}✅ Folders: $FOLDER_COUNT${NC}"
        echo -e "${GREEN}✅ Total Requests: $TOTAL_REQUESTS${NC}"
        
        # Validate each folder
        echo ""
        echo "📁 Folder Structure:"
        jq -r '.item[] | "  - \(.name): \(.item | length) requests"' "$COLLECTION_FILE"
        
        # Check for required fields
        echo ""
        echo "🔍 Checking Required Fields..."
        
        if jq -e '.info.name' "$COLLECTION_FILE" > /dev/null; then
            echo -e "${GREEN}✅ info.name exists${NC}"
        else
            echo -e "${RED}❌ info.name missing${NC}"
            ERRORS=$((ERRORS + 1))
        fi
        
        if jq -e '.info.schema' "$COLLECTION_FILE" > /dev/null; then
            echo -e "${GREEN}✅ info.schema exists${NC}"
        else
            echo -e "${RED}❌ info.schema missing${NC}"
            ERRORS=$((ERRORS + 1))
        fi
        
        # Check if all requests have tests
        echo ""
        echo "🧪 Checking Test Scripts..."
        REQUESTS_WITH_TESTS=$(jq '[.item[].item[] | select(.event != null) | select(.event[].listen == "test")] | length' "$COLLECTION_FILE")
        echo -e "${GREEN}✅ Requests with test scripts: $REQUESTS_WITH_TESTS / $TOTAL_REQUESTS${NC}"
        
    else
        echo -e "${RED}❌ Invalid JSON format${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Validate Environment File
ENV_FILE="postman/Employee-Management-CRM.postman_environment.json"
echo "🌍 Validating Environment File: $ENV_FILE"

if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Environment file not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    # Check if valid JSON
    if jq empty "$ENV_FILE" 2>/dev/null; then
        echo -e "${GREEN}✅ Valid JSON format${NC}"
        
        # Extract and display environment info
        ENV_NAME=$(jq -r '.name' "$ENV_FILE")
        VAR_COUNT=$(jq '.values | length' "$ENV_FILE")
        
        echo -e "${GREEN}✅ Environment Name: $ENV_NAME${NC}"
        echo -e "${GREEN}✅ Variables: $VAR_COUNT${NC}"
        
        # List all variables
        echo ""
        echo "🔑 Environment Variables:"
        jq -r '.values[] | "  - \(.key): \(.value // "(empty)")"' "$ENV_FILE"
        
        # Check for required variables
        echo ""
        echo "🔍 Checking Required Variables..."
        
        REQUIRED_VARS=("baseUrl" "secretWord" "employeeToken" "adminToken")
        for var in "${REQUIRED_VARS[@]}"; do
            if jq -e ".values[] | select(.key == \"$var\")" "$ENV_FILE" > /dev/null; then
                echo -e "${GREEN}✅ $var exists${NC}"
            else
                echo -e "${RED}❌ $var missing${NC}"
                ERRORS=$((ERRORS + 1))
            fi
        done
        
    else
        echo -e "${RED}❌ Invalid JSON format${NC}"
        ERRORS=$((ERRORS + 1))
    fi
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Validate README
README_FILE="postman/README.md"
echo "📝 Validating README File: $README_FILE"

if [ ! -f "$README_FILE" ]; then
    echo -e "${RED}❌ README file not found${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}✅ README exists${NC}"
    
    WORD_COUNT=$(wc -w < "$README_FILE")
    echo -e "${GREEN}✅ Word count: $WORD_COUNT words${NC}"
    
    # Check for required sections
    echo ""
    echo "🔍 Checking README Sections..."
    
    REQUIRED_SECTIONS=("Getting Started" "Collection Structure" "Authentication Flow" "Running Tests")
    for section in "${REQUIRED_SECTIONS[@]}"; do
        if grep -q "$section" "$README_FILE"; then
            echo -e "${GREEN}✅ Section found: $section${NC}"
        else
            echo -e "${YELLOW}⚠️  Section not found: $section${NC}"
        fi
    done
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Final Summary
if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All validations passed!${NC}"
    echo ""
    echo "📊 Summary:"
    echo "  - Collection: $COLLECTION_NAME"
    echo "  - Total Requests: $TOTAL_REQUESTS"
    echo "  - Test Coverage: $REQUESTS_WITH_TESTS requests with tests"
    echo "  - Environment: $ENV_NAME"
    echo "  - Variables: $VAR_COUNT"
    echo ""
    echo -e "${GREEN}✨ Postman collection is ready to use!${NC}"
    exit 0
else
    echo -e "${RED}❌ Validation failed with $ERRORS error(s)${NC}"
    echo ""
    echo "Please fix the errors above before using the collection."
    exit 1
fi
