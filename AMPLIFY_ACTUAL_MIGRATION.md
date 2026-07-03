```bash
npm install -g @aws-amplify/cli@14
amplify --version
```


```bash
npx cdk bootstrap aws://068884799909/us-east-2
```

Ensure backend has the righjt version
```
amplify push
```


Need these permissions. For dev was role `us-east-2_50KgermZ3_Full-access`
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Effect": "Allow",
			"Action": [
				"cloudformation:CreateStackRefactor",
				"cloudformation:DescribeStackRefactor",
				"cloudformation:ExecuteStackRefactor",
				"cloudformation:GetStackPolicy",
				"cloudformation:SetStackPolicy",
				"cloudformation:DeleteChangeSet",
				"cloudformation:DetectStackResourceDrift",
				"cloudformation:DetectStackDrift",
				"cloudformation:DescribeStackDriftDetectionStatus"
			],
			"Resource": "arn:aws:cloudformation:*:*:stack/amplify-*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"s3:GetBucketVersioning",
				"s3:GetEncryptionConfiguration"
			],
			"Resource": "*"
		},
		{
			"Effect": "Allow",
			"Action": [
				"cloudformation:GetResource"
			],
			"Resource": "*"
		}
	]
}
```